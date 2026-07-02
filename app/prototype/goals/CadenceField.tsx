"use client";

import type { LucideIcon } from "lucide-react";
import { Field, FieldDescription } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

export function CadenceField({
  icon: Icon,
  label,
  value,
  onChange,
  error,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <Field data-invalid={error ? true : undefined}>
      <InputGroup>
        <InputGroupAddon>
          <Icon />
        </InputGroupAddon>
        <InputGroupInput
          inputMode="numeric"
          aria-label={label}
          aria-invalid={error ? true : undefined}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </InputGroup>
      {error && <FieldDescription>{error}</FieldDescription>}
    </Field>
  );
}
