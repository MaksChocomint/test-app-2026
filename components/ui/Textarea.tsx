import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export const Textarea = React.memo(
  React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, required, className = "", ...props }, ref) => {
      const baseClasses =
        "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-mint focus:border-transparent resize-none transition-all";

      return (
        <div className="w-full">
          {label && (
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
              {required && <span className="text-red-500"> *</span>}
            </label>
          )}
          <textarea
            ref={ref}
            className={`${baseClasses} ${className}`}
            {...props}
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
      );
    },
  ),
);

Textarea.displayName = "Textarea";
Textarea.displayName = "Textarea";
