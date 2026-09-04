function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="mt-0.5 h-5 w-5 shrink-0 text-green" aria-hidden>
      <circle cx="10" cy="10" r="9" fill="currentColor" fillOpacity="0.12" />
      <path
        d="M6 10.2 8.6 12.8 14 7.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-[1.0625rem] leading-snug text-charcoal">
          <CheckIcon />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
