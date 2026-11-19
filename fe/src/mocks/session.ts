"use client";

import { useSyncExternalStore } from "react";
import { useAccounts } from "./db";
import type { Account, RoleCode } from "./types";

const KEY = "peasy-mock-session";
const listeners = new Set<() => void>();

function readSessionId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return (
      window.sessionStorage.getItem(KEY) ?? window.localStorage.getItem(KEY)
    );
  } catch {
    return null;
  }
}

function notify() {
  listeners.forEach((l) => l());
}

export function startSession(accountId: string, remember: boolean) {
  try {
    window.sessionStorage.removeItem(KEY);
    window.localStorage.removeItem(KEY);
    (remember ? window.localStorage : window.sessionStorage).setItem(
      KEY,
      accountId,
    );
  } catch {
    /* bỏ qua */
  }
  notify();
}

export function endSession() {
  try {
    window.sessionStorage.removeItem(KEY);
    window.localStorage.removeItem(KEY);
  } catch {
    /* bỏ qua */
  }
  notify();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

const noopSubscribe = () => () => {};

/** ready=false cho tới khi component đã chạy trên trình duyệt. */
export function useMockSession(): { ready: boolean; account: Account | null } {
  const ready = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  const sessionId = useSyncExternalStore(subscribe, readSessionId, () => null);
  const accounts = useAccounts();
  const account =
    sessionId != null
      ? (accounts.find((a) => a.id === sessionId && a.status === "HOAT_DONG") ??
        null)
      : null;
  return { ready, account };
}

export function homeFor(role: RoleCode): string {
  return role === "QUAN_TRI_VIEN" ? "/admin/settings" : "/welcome";
}
