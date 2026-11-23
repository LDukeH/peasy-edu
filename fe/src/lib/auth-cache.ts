import type { UserDto } from "@/api/generated/model";

const STORAGE_KEY = "peasy.auth.user";
const LOGOUT_SIGNAL_KEY = "peasy.auth.logout_at";
const CHANGE_EVENT = "peasy:auth-cache-change";

let cachedRaw: string | null | undefined = undefined;
let cachedParsed: UserDto | null = null;

function readRawFromStorages(): string | null {
  return (
    window.localStorage.getItem(STORAGE_KEY) ??
    window.sessionStorage.getItem(STORAGE_KEY)
  );
}

export function readCachedUser(): UserDto | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = readRawFromStorages();
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

export function writeCachedUser(
  user: UserDto | null,
  options?: { persistent?: boolean },
): void {
  if (typeof window === "undefined") return;
  try {
    const nextRaw = user ? JSON.stringify(user) : null;
    if (!nextRaw) {
      const hadLocal = window.localStorage.getItem(STORAGE_KEY) !== null;
      const hadSession = window.sessionStorage.getItem(STORAGE_KEY) !== null;
      window.localStorage.removeItem(STORAGE_KEY);
      window.sessionStorage.removeItem(STORAGE_KEY);
      cachedRaw = null;
      cachedParsed = null;
      if (hadLocal || hadSession) {
        window.dispatchEvent(new Event(CHANGE_EVENT));
      }
      return;
    }

    const persistent =
      options?.persistent ??
      !(
        window.localStorage.getItem(STORAGE_KEY) === null &&
        window.sessionStorage.getItem(STORAGE_KEY) !== null
      );

    const target = persistent ? window.localStorage : window.sessionStorage;
    const other = persistent ? window.sessionStorage : window.localStorage;
    const alreadyStored =
      target.getItem(STORAGE_KEY) === nextRaw &&
      other.getItem(STORAGE_KEY) === null;

    if (alreadyStored && nextRaw === cachedRaw) return;

    target.setItem(STORAGE_KEY, nextRaw);
    other.removeItem(STORAGE_KEY);
    cachedRaw = nextRaw;
    cachedParsed = user;
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // Bỏ qua nếu trình duyệt chặn storage (private mode)
  }
}

export function broadcastAuthLogout(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOGOUT_SIGNAL_KEY, String(Date.now()));
  } catch {
    // Bỏ qua nếu trình duyệt chặn localStorage
  }
}

export function subscribeCachedUser(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onStorage = (e: StorageEvent) => {
    if (
      e.key === null ||
      e.key === STORAGE_KEY ||
      e.key === LOGOUT_SIGNAL_KEY
    ) {
      if (
        e.key === LOGOUT_SIGNAL_KEY ||
        ((e.key === null || e.key === STORAGE_KEY) && e.newValue === null)
      ) {
        try {
          window.sessionStorage.removeItem(STORAGE_KEY);
        } catch {
          // Bỏ qua
        }
      }
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

export function subscribeCrossTabAuthChange(
  onChange: (kind: "logout" | "login") => void,
): () => void {
  if (typeof window === "undefined") return () => {};
  const onStorage = (e: StorageEvent) => {
    if (e.key === LOGOUT_SIGNAL_KEY && e.newValue !== null) {
      try {
        window.sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // Bỏ qua
      }
      cachedRaw = undefined;
      window.dispatchEvent(new Event(CHANGE_EVENT));
      onChange("logout");
      return;
    }

    if (e.key === null || e.key === STORAGE_KEY) {
      cachedRaw = undefined;
      if (e.newValue === null) {
        try {
          window.sessionStorage.removeItem(STORAGE_KEY);
        } catch {
          // Bỏ qua
        }
        window.dispatchEvent(new Event(CHANGE_EVENT));
        onChange("logout");
      } else {
        window.dispatchEvent(new Event(CHANGE_EVENT));
        onChange("login");
      }
    }
  };
  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}
