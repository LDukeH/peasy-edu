"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import {
  getAuthMeQueryKey,
  useAuthLogout,
  useAuthMe,
} from "@/api/generated/peasyApi";
import type { UserDto } from "@/api/generated/model";
import {
  broadcastAuthLogout,
  readCachedUser,
  subscribeCachedUser,
  writeCachedUser,
} from "@/lib/auth-cache";
import { mapUserDtoToProfile } from "@/lib/auth-labels";
import { useAuthStore } from "@/stores/auth-store";

const getServerSnapshot = (): UserDto | null => null;

export function useAuthSession(): {
  ready: boolean;
  user: UserDto | null;
  isLoading: boolean;
  isAuthenticated: boolean;
} {
  const cachedUser = useSyncExternalStore(
    subscribeCachedUser,
    readCachedUser,
    getServerSnapshot,
  );

  const { data, isPending, isError } = useAuthMe({
    query: {
      retry: false,
      staleTime: 60_000,
    },
  });

  // Nếu API đã trả về (data hoặc lỗi), dùng kết quả thật từ BE; trong lúc đang tải, hiển thị tạm từ cache (0ms)
  const resolvedUser = isError ? null : (data ?? null);
  const user = isPending ? cachedUser : resolvedUser;
  const ready = !isPending || cachedUser !== null;

  useEffect(() => {
    if (isPending) {
      if (cachedUser) {
        useAuthStore.getState().setUser(mapUserDtoToProfile(cachedUser));
      }
      return;
    }

    if (resolvedUser) {
      writeCachedUser(resolvedUser);
      useAuthStore.getState().setUser(mapUserDtoToProfile(resolvedUser));
    } else {
      writeCachedUser(null);
      useAuthStore.getState().logout();
    }
  }, [isPending, resolvedUser, cachedUser]);

  return {
    ready,
    user,
    isLoading: isPending && !cachedUser,
    isAuthenticated: Boolean(user),
  };
}

export function useSignOut() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logoutMutation = useAuthLogout();

  const signOut = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      // Kể cả khi API lỗi vẫn dọn state client và quay về /login
    } finally {
      writeCachedUser(null);
      broadcastAuthLogout();
      queryClient.removeQueries({
        predicate: (q) => q.queryKey[0] !== "/api/auth/me",
      });
      queryClient.setQueryData(getAuthMeQueryKey(), null);
      useAuthStore.getState().logout();
      router.replace("/login");
    }
  };

  return {
    signOut,
    isPending: logoutMutation.isPending,
  };
}
