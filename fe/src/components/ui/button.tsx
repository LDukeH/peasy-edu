import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger";

export function buttonClasses(variant: Variant = "primary", disabled = false) {
  const base =
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-[11px] text-sm font-semibold leading-5 transition-colors";
  if (disabled)
    return `${base} cursor-not-allowed bg-table-line text-[#8594a8] opacity-45`;
  const map: Record<Variant, string> = {
    primary: "bg-brand text-white hover:bg-brand-hover cursor-pointer",
    secondary:
      "border border-line bg-white text-body hover:bg-canvas cursor-pointer",
    danger: "bg-danger text-white hover:opacity-90 cursor-pointer",
  };
  return `${base} ${map[variant]}`;
}

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  disabled,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`${buttonClasses(variant, disabled)} ${className}`}
      {...rest}
    />
  );
}
