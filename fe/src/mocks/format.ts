export function normalizePhone(value: string): string {
  return value.replace(/\D/g, "");
}

export function formatPhone(digits: string): string {
  const d = normalizePhone(digits);
  if (d.length === 10) return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
  return digits;
}

export function isValidPhone(value: string): boolean {
  return /^0\d{9}$/.test(normalizePhone(value));
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidPassword(value: string): boolean {
  return value.length >= 10 && /[A-Za-z]/.test(value) && /\d/.test(value);
}

export function initials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}
