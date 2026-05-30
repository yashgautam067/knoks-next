"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-body text-silver mb-2 uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full bg-card border border-border text-cream px-4 py-3",
            "font-body text-sm placeholder:text-silver/40",
            "focus:outline-none focus:border-red focus:ring-1 focus:ring-red/20",
            "transition-colors duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-red",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-red font-body">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-xs text-silver/60 font-body">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
