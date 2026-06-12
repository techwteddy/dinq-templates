"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { CURRENCY, LOCALE } from "@/lib/constants";

function formatAmount(cents: number): string {
  return new Intl.NumberFormat(LOCALE, { style: "currency", currency: CURRENCY }).format(cents / 100);
}

function parseToCents(text: string): number {
  const digits = text.replace(/\D/g, "");
  return digits ? Number(digits) : 0;
}

export type CurrencyInputProps = {
  value: number;
  onChange: (amount: number) => void;
  disabled?: boolean;
  id?: string;
  placeholder?: string;
};

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, disabled, id, placeholder }, ref) => {
    const display = value > 0 ? formatAmount(Math.round(value * 100)) : "";
    return (
      <Input
        ref={ref}
        id={id}
        inputMode="numeric"
        disabled={disabled}
        placeholder={placeholder ?? formatAmount(0)}
        value={display}
        onChange={(e) => {
          const cents = parseToCents(e.target.value);
          onChange(cents / 100);
        }}
      />
    );
  },
);
CurrencyInput.displayName = "CurrencyInput";
