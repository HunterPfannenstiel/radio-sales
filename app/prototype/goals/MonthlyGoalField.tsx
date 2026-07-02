"use client";

import { DollarSignIcon } from "lucide-react";
import { Field, FieldDescription } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

export function MonthlyGoalField({
  value,
  onChange,
  error,
  large = false,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  large?: boolean;
}) {
  return (
    <Field data-invalid={error ? true : undefined}>
      <InputGroup>
        <InputGroupAddon>
          <DollarSignIcon />
        </InputGroupAddon>
        <InputGroupInput
          inputMode="numeric"
          aria-label="Monthly goal"
          aria-invalid={error ? true : undefined}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={cn(large && "text-lg font-semibold")}
        />
      </InputGroup>
      {error && <FieldDescription>{error}</FieldDescription>}
    </Field>
  );
}
