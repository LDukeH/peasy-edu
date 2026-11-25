import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "default"
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "danger"
  | "link"
  | "accent";

export type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const baseStyles =
  "inline-flex items-center justify-center whitespace-nowrap rounded-[8px] font-semibold leading-5 transition-colors focus-visible:outline-2 focus-visible:outline-[#116f7c] focus-visible:outline-offset-2 disabled:pointer-events-none disabled:bg-[#e3e8f0] disabled:text-[#8594a8] disabled:border-transparent disabled:opacity-60 cursor-pointer select-none";

const variants: Record<ButtonVariant, string> = {
  default: "bg-[#116f7c] text-white hover:bg-[#0e5f6a] active:bg-[#0c535d]",
  primary: "bg-[#116f7c] text-white hover:bg-[#0e5f6a] active:bg-[#0c535d]",
  secondary:
    "bg-white border border-[#dce4eb] text-[#33465c] hover:bg-[#f5f8fa]",
  outline:
    "bg-white border border-[#dce4eb] text-[#33465c] hover:bg-[#f5f8fa]",
  ghost: "bg-transparent text-[#33465c] hover:bg-[#eaf0f5]",
  destructive: "bg-[#c93b3b] text-white hover:bg-[#b33232]",
  danger: "bg-[#c93b3b] text-white hover:bg-[#b33232]",
  link: "text-[#116f7c] underline-offset-4 hover:underline p-0 h-auto bg-transparent",
  accent: "bg-[#77c5cf] text-[#172b4d] hover:bg-[#66b8c3]",
};

const sizes: Record<ButtonSize, string> = {
  default: "h-[44px] px-4 py-3 text-sm",
  sm: "h-9 rounded-[8px] px-3 text-xs",
  lg: "h-12 rounded-[8px] px-6 text-base",
  icon: "h-10 w-10",
};

export function buttonClasses(
  variant: ButtonVariant = "default",
  disabled = false,
  size: ButtonSize = "default",
) {
  return cn(
    baseStyles,
    variants[variant],
    sizes[size],
    disabled && "pointer-events-none bg-[#e3e8f0] text-[#8594a8] border-transparent opacity-60",
  );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      type = "button",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
