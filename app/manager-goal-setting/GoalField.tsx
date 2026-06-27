"use client";

interface GoalFieldProps {
  label: string;
  value: number;
  originalValue: number;
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  onChange: (raw: string) => void;
  prefix?: string;
}

export function GoalField({
  label,
  value,
  originalValue,
  isActive,
  onActivate,
  onDeactivate,
  onChange,
  prefix,
}: GoalFieldProps) {
  const isChanged = value !== originalValue;

  const originalDisplay = prefix
    ? `${prefix}${originalValue.toLocaleString()}`
    : originalValue.toLocaleString();

  return (
    <div className="flex items-center gap-8 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-0.5">
          {prefix && <span className="text-base font-medium">{prefix}</span>}
          <input
            value={String(value)}
            inputMode="numeric"
            onChange={(e) => onChange(e.target.value)}
            onFocus={onActivate}
            onBlur={onDeactivate}
            style={{ fieldSizing: "content" } as React.CSSProperties}
            className={
              isActive
                ? "text-base font-medium tabular-nums bg-transparent border-0 border-b border-border outline-none p-0"
                : "text-base font-medium tabular-nums bg-transparent border-0 outline-none p-0 cursor-pointer"
            }
          />
        </div>
        <span className={`text-xs text-muted-foreground ${isChanged ? "visible" : "invisible"}`}>
          previously {originalDisplay}
        </span>
      </div>
    </div>
  );
}
