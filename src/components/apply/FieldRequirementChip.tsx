export function FieldRequirementChip({
  kind,
}: {
  kind: "required" | "helps";
}) {
  if (kind === "required") {
    return (
      <span className="ml-2 inline-flex align-middle rounded-md bg-green-soft px-1.5 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-[0.04em] text-green">
        Required
      </span>
    );
  }
  return (
    <span className="ml-2 inline-flex align-middle rounded-md bg-paper px-1.5 py-0.5 text-[0.6875rem] font-medium tracking-[-0.01em] text-steel">
      Helps your package
    </span>
  );
}
