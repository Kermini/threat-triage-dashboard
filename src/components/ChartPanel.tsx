import { ReactNode } from "react";

interface ChartPanelProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function ChartPanel({ title, subtitle, children }: ChartPanelProps) {
  return (
    <section className="rounded-xl border border-line bg-panel p-4 shadow-neon">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-text">{title}</h2>
          <p className="text-xs text-muted">{subtitle}</p>
        </div>
      </div>
      <div className="h-72">{children}</div>
    </section>
  );
}
