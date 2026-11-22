import type { UserDto } from "@/api/generated/model";

const STORAGE_KEY = "peasy.auth.user";
const CHANGE_EVENT = "peasy:auth-cache-change";

let cachedRaw: string | null | undefined = undefined;
let cachedParsed: UserDto | null = null;

export function readCachedUser(): UserDto | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedParsed;
    cachedRaw = raw;
    cachedParsed = raw ? (JSON.parse(raw) as UserDto) : null;
    return cachedParsed;
  } catch {
    cachedRaw = null;
    cachedParsed = null;
    return null;
  }
}

export function writeCachedUser(user: UserDto | null): void {
  if (typeof window === "undefined") return;
  try {
    const nextRaw = user ? JSON.stringify(user) : null;
    if (nextRaw === cachedRaw) return;
    if (nextRaw) {
      window.localStorage.setItem(STORAGE_KEY, nextRaw);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    cachedRaw = nextRaw;
    cachedParsed = user;
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // Bỏ qua nếu trình duyệt chặn localStorage (private mode)
  }
}

export function subscribeCachedUser(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === STORAGE_KEY) {
      cachedRaw = undefined;
      callback();
    }
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}
