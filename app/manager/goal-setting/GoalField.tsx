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

  const originalDisplay = prefix
    ? `${prefix}${originalValue.toLocaleString()}`
    : originalValue.toLocaleString();

  return (
    <div className="flex items-center gap-8 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-0.5">
          {prefix && <span className="text-sm font-medium">{prefix}</span>}
          <input
            value={isFocused ? String(value) : value.toLocaleString()}
            inputMode="numeric"
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{ fieldSizing: "content", fontSize: "16px" } as React.CSSProperties}
            className={`min-w-0 font-medium tabular-nums bg-transparent border-0 outline-none p-0 cursor-text ${
              isFocused ? "border-b border-border" : ""
            }`}
          />
        </div>
        <span className={`text-xs text-muted-foreground ${isChanged ? "visible" : "invisible"}`}>
          previously {originalDisplay}
        </span>
      </div>
    </div>
  );
}
