"use client";

/**
 * Mock "database" chạy hoàn toàn ở trình duyệt (localStorage).
 * CHƯA gọi backend. Khi nối API thật, thay các hàm trong file này
 * bằng hook orval tương ứng.
 */
import { useSyncExternalStore } from "react";
import { createSeed } from "./seed";
import { DEMO_PASSWORD } from "./seed";
import { normalizePhone } from "./format";
import type {
  Account,
  CategoryGroup,
  CategoryItem,
  CenterInfo,
  DbState,
  RoleCode,
} from "./types";

const KEY = "peasy-mock-db-v1";
const SERVER_STATE: DbState = createSeed();

let current: DbState | null = null;
const listeners = new Set<() => void>();

function read(): DbState {
  if (typeof window === "undefined") return SERVER_STATE;
  if (current) return current;
  try {
    const raw = window.localStorage.getItem(KEY);
    current = raw ? (JSON.parse(raw) as DbState) : createSeed();
  } catch {
    current = createSeed();
  }
  return current;
}

function write(next: DbState) {
  current = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* bỏ qua: localStorage đầy hoặc bị chặn */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      current = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function useSlice<K extends keyof DbState>(key: K): DbState[K] {
  return useSyncExternalStore(
    subscribe,
    () => read()[key],
    () => SERVER_STATE[key],
  );
}

export const useAccounts = () => useSlice("accounts");
export const useCategories = () => useSlice("categories");
export const useCenterInfo = () => useSlice("center");

/* ------------------------------ actions ------------------------------ */

export type Result<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; field?: string };

const delay = (ms = 450) => new Promise((r) => setTimeout(r, ms));
const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 9)}`;

function nextCode(accounts: Account[]): string {
  const max = accounts.reduce(
    (m, a) => Math.max(m, Number(a.code.replace(/\D/g, "")) || 0),
    0,
  );
  return `TK-${String(max + 1).padStart(4, "0")}`;
}

export async function authenticate(
  phone: string,
  password: string,
): Promise<Result<Account>> {
  await delay();
  const p = normalizePhone(phone);
  const account = read().accounts.find((a) => a.phone === p);
  if (!account)
    return {
      ok: false,
      field: "phone",
      error: "Số điện thoại chưa được đăng ký.",
    };
  if (account.password !== password)
    return {
      ok: false,
      field: "password",
      error: "Mật khẩu chưa đúng. Vui lòng kiểm tra và thử lại.",
    };
  if (account.status === "BI_KHOA")
    return {
      ok: false,
      field: "form",
      error: "Tài khoản đã bị khóa. Vui lòng liên hệ 028 3822 0123.",
    };
  if (account.status === "CHO_KICH_HOAT")
    return {
      ok: false,
      field: "form",
      error: "Tài khoản chưa được kích hoạt. Hãy xác minh email hoặc nhờ Quản trị viên kích hoạt.",
    };
  return { ok: true, data: account };
}

interface NewAccountInput {
  fullName: string;
  phone: string;
  email?: string;
  role: RoleCode;
  password?: string;
  status: Account["status"];
}

function insertAccount(input: NewAccountInput): Result<Account> {
  const state = read();
  const phone = normalizePhone(input.phone);
  if (state.accounts.some((a) => a.phone === phone))
    return {
      ok: false,
      field: "phone",
      error: "Số điện thoại này đã có tài khoản.",
    };
  const email = input.email?.trim() || undefined;
  if (
    email &&
    state.accounts.some((a) => a.email?.toLowerCase() === email.toLowerCase())
  )
    return { ok: false, field: "email", error: "Email này đã được sử dụng." };
  const account: Account = {
    id: uid("acc"),
    code: nextCode(state.accounts),
    fullName: input.fullName.trim(),
    phone,
    email,
    role: input.role,
    status: input.status,
    password: input.password ?? DEMO_PASSWORD,
  };
  write({ ...state, accounts: [...state.accounts, account] });
  return { ok: true, data: account };
}

export async function registerAccount(input: {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  role: "PHU_HUYNH" | "GIA_SU";
}): Promise<Result<Account>> {
  await delay(600);
  return insertAccount({ ...input, status: "CHO_KICH_HOAT" });
}

export async function createAccountByAdmin(input: {
  fullName: string;
  phone: string;
  email?: string;
  role: RoleCode;
}): Promise<Result<Account>> {
  await delay();
  return insertAccount({ ...input, status: "CHO_KICH_HOAT" });
}

export function discardAccount(id: string) {
  const state = read();
  write({ ...state, accounts: state.accounts.filter((a) => a.id !== id) });
}

export function setAccountStatus(id: string, status: Account["status"]) {
  const state = read();
  write({
    ...state,
    accounts: state.accounts.map((a) => (a.id === id ? { ...a, status } : a)),
  });
}

export async function requestRole(input: {
  accountId: string;
  requestedRole: RoleCode;
  reason: string;
}): Promise<Result> {
  await delay();
  const state = read();
  write({
    ...state,
    roleRequests: [
      ...state.roleRequests,
      { id: uid("rr"), createdAt: new Date().toISOString(), ...input },
    ],
  });
  return { ok: true, data: undefined };
}

export async function saveCategory(input: {
  id?: string;
  group: CategoryGroup;
  name: string;
  description: string;
  active: boolean;
}): Promise<Result<CategoryItem>> {
  await delay(300);
  const state = read();
  const name = input.name.trim();
  const dup = state.categories.some(
    (c) =>
      c.group === input.group &&
      c.id !== input.id &&
      c.name.toLowerCase() === name.toLowerCase(),
  );
  if (dup)
    return {
      ok: false,
      field: "name",
      error: "Tên này đã có trong nhóm danh mục.",
    };
  if (input.id) {
    const updated = state.categories.map((c) =>
      c.id === input.id
        ? { ...c, name, description: input.description.trim(), active: input.active }
        : c,
    );
    write({ ...state, categories: updated });
    return { ok: true, data: updated.find((c) => c.id === input.id)! };
  }
  const item: CategoryItem = {
    id: uid(input.group.toLowerCase()),
    group: input.group,
    name,
    description: input.description.trim(),
    active: input.active,
  };
  write({ ...state, categories: [...state.categories, item] });
  return { ok: true, data: item };
}

export async function saveCenterInfo(center: CenterInfo): Promise<Result> {
  await delay(300);
  write({ ...read(), center });
  return { ok: true, data: undefined };
}

export function resetMockDb() {
  write(createSeed());
}
