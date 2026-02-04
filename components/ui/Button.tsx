import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-brand-mint text-white hover:bg-brand-mint/90",
  secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-4 py-3 text-base",
};

export const Button = React.memo(
  React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
      {
        variant = "primary",
        size = "md",
        isLoading = false,
        disabled = false,
        className = "",
        children,
        ...props
      },
      ref,
    ) => {
      const baseClasses =
        "rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

      return (
        <button
          ref={ref}
          disabled={disabled || isLoading}
          className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
          {...props}
        >
          {isLoading ? "Загрузка..." : children}
        </button>
      );
    },
  ),
);

Button.displayName = "Button";
