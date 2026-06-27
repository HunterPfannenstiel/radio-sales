type StackedCellProps = {
  primary: string;
  secondary: string;
  primaryColor?: string;
  secondaryColor?: string;
};

export function StackedCell({
  primary,
  secondary,
  primaryColor,
  secondaryColor,
}: StackedCellProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span
        className="font-heading text-2xl font-bold leading-none tabular-nums"
        style={{ color: primaryColor ?? "var(--color-text-primary)" }}
      >
        {primary}
      </span>
      <span
        className="text-xs leading-none tabular-nums"
        style={{ color: secondaryColor ?? "var(--color-text-secondary)" }}
      >
        {secondary}
      </span>
    </div>
  );
}
