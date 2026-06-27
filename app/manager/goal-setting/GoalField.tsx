"use client";

import { useState } from "react";

interface GoalFieldProps {
  label: string;
  value: number;
  originalValue: number;
  onChange: (raw: string) => void;
  prefix?: string;
}

export function GoalField({ label, value, originalValue, onChange, prefix }: GoalFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isChanged = value !== originalValue;
  const displayValue = isFocused ? String(value) : value.toLocaleString();

  const originalDisplay = prefix
    ? `${prefix}${originalValue.toLocaleString()}`
    : originalValue.toLocaleString();

  return (
    <div className="flex items-center gap-4 py-3">
      <span className="text-sm text-muted-foreground whitespace-nowrap shrink-0">{label}</span>
      <div className="flex items-center gap-2">
        {prefix && <span className="text-sm font-medium shrink-0">{prefix}</span>}
        {/* Grid overlay: hidden span sizes the cell, input fills it exactly */}
        <span className="inline-grid">
          <span
            className="invisible font-medium tabular-nums col-start-1 row-start-1 whitespace-pre"
            style={{ fontSize: "16px" }}
            aria-hidden
          >
            {displayValue}
          </span>
          <input
            value={displayValue}
            inputMode="numeric"
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{ fontSize: "16px" }}
            className={`col-start-1 row-start-1 w-full font-medium tabular-nums bg-transparent border-0 outline-none p-0 cursor-text ${
              isFocused ? "border-b border-border" : ""
            }`}
          />
        </span>
        <span className={`text-xs text-muted-foreground whitespace-nowrap shrink-0 ${isChanged ? "visible" : "invisible"}`}>
          previously {originalDisplay}
        </span>
      </div>
    </div>
  );
}
