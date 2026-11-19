"use client";

import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

type Variant = "auth" | "dialog";

interface ShellProps {
  label: string;
  error?: string;
  hint?: string;
  variant?: Variant;
  className?: string;
}

const labelCls: Record<Variant, string> = {
  auth: "text-xs leading-[18px] text-text-muted",
  dialog: "text-sm font-semibold leading-5 text-ink",
};

function controlCls(variant: Variant, hasError: boolean) {
  const base =
    "w-full rounded-lg bg-white text-sm leading-[22px] text-ink placeholder:text-[#8594a8] disabled:bg-canvas disabled:text-text-muted";
  const pad = variant === "auth" ? "px-3 py-2.5" : "px-3.5 py-3";
  const border = hasError
    ? "border-[1.5px] border-danger-field"
    : variant === "auth"
      ? "border border-field"
      : "border border-line-strong";
  return `${base} ${pad} ${border}`;
}

function Shell({
  id,
  label,
  error,
  hint,
  variant = "auth",
  className = "",
  children,
}: ShellProps & { id: string; children: ReactNode }) {
  return (
    <div
      className={`flex min-w-0 flex-col ${variant === "auth" ? "gap-1.5" : "gap-2"} ${className}`}
    >
      <label htmlFor={id} className={labelCls[variant]}>
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-msg`} role="alert" className="text-xs leading-[18px] text-danger-field">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-msg`} className="text-xs leading-[18px] text-text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function Field({
  label,
  error,
  hint,
  variant = "auth",
  className,
  ...rest
}: ShellProps & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <Shell id={id} {...{ label, error, hint, variant, className }}>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error || hint ? `${id}-msg` : undefined}
        className={controlCls(variant, !!error)}
        {...rest}
      />
    </Shell>
  );
}

export function SelectField({
  label,
  error,
  hint,
  variant = "dialog",
  className,
  children,
  ...rest
}: ShellProps & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <Shell id={id} {...{ label, error, hint, variant, className }}>
      <select
        id={id}
        aria-invalid={!!error}
        className={controlCls(variant, !!error)}
        {...rest}
      >
        {children}
      </select>
    </Shell>
  );
}

export function TextareaField({
  label,
  error,
  hint,
  variant = "dialog",
  className,
  ...rest
}: ShellProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <Shell id={id} {...{ label, error, hint, variant, className }}>
      <textarea
        id={id}
        rows={2}
        aria-invalid={!!error}
        className={`${controlCls(variant, !!error)} resize-none`}
        {...rest}
      />
    </Shell>
  );
}
