interface OverviewCardProps {
  label: string;
  value: number;
  hint: string;
}

export function OverviewCard({ label, value, hint }: OverviewCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-panel px-5 py-4 shadow-neon">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/70 to-transparent" />
      <p className="text-xs uppercase tracking-[0.25em] text-muted">{label}</p>
      <div className="mt-4 flex items-end justify-between gap-3">
        <p className="text-3xl font-semibold text-text">{value}</p>
        <p className="max-w-[11rem] text-right text-xs text-muted">{hint}</p>
      </div>
    </div>
  );
}
