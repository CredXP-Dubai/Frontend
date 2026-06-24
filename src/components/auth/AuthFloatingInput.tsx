"use client";

import { motion } from "framer-motion";
import { useId, useState } from "react";

interface AuthFloatingInputProps {
  id?: string;
  label: string;
  type?: "text" | "email" | "password";
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
  error?: boolean;
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path
          d="M2.5 12C4.5 7.5 8 5 12 5s7.5 2.5 9.5 7c-2 4.5-5.5 7-9.5 7s-7.5-2.5-9.5-7Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M3 3l18 18M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-4.4M7.2 7.2C8.6 6.2 10.2 5.6 12 5.6c4 0 7.4 2.5 9.4 6.4-1 1.7-2.3 3.1-3.8 4.1M5.1 5.7C3.6 6.9 2.3 8.5 1.4 10.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AuthFloatingInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  autoComplete,
  required,
  minLength,
  error = false,
}: AuthFloatingInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;
  const floated = focused || value.length > 0;

  return (
    <div className="relative">
      <motion.div
        className={`pointer-events-none absolute inset-0 rounded-xl border transition-colors duration-300 ${
          error
            ? "border-red-400/50"
            : focused
              ? "border-[#C8102E]/70 shadow-[0_0_0_1px_rgba(200,16,46,0.2)]"
              : "border-black/10"
        }`}
        animate={focused ? { scale: 1.01 } : { scale: 1 }}
        transition={{ duration: 0.25 }}
      />

      <input
        id={inputId}
        type={inputType}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        placeholder=" "
        className="peer relative z-10 w-full rounded-xl border-0 bg-[#F7F7F7] px-4 pt-6 pb-3 text-black outline-none transition-colors duration-300 placeholder-transparent autofill:shadow-[inset_0_0_0_1000px_#f7f7f7] autofill:[-webkit-text-fill-color:black]"
      />

      <label
        htmlFor={inputId}
        className={`pointer-events-none absolute left-4 z-20 origin-left transition-all duration-300 ${
          floated
            ? "top-2.5 translate-y-0 text-[0.65rem] tracking-[0.14em] text-[#C8102E] uppercase"
            : "top-1/2 -translate-y-1/2 text-sm text-black/45"
        }`}
      >
        {label}
      </label>

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword((visible) => !visible)}
          className="absolute top-1/2 right-3 z-20 -translate-y-1/2 rounded-lg p-1.5 text-black/45 transition-colors hover:text-[#C8102E]"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          <EyeIcon open={showPassword} />
        </button>
      )}
    </div>
  );
}
