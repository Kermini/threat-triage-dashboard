import { SecurityEvent } from "../types";
import { formatTimestamp, severityTone, statusTone } from "../lib/format";

interface IncidentPanelProps {
  event: SecurityEvent | null;
  onNotesChange: (id: string, notes: string) => void;
  onToggleReviewed: (id: string) => void;
}

export function IncidentPanel({
  event,
  onNotesChange,
  onToggleReviewed,
}: IncidentPanelProps) {
  if (!event) {
    return (
      <aside className="rounded-xl border border-line bg-panel p-5 shadow-neon">
        <p className="text-sm text-muted">
          Select an event to inspect details, add notes, or mark it reviewed.
        </p>
      </aside>
    );
  }

  return (
    <aside className="rounded-xl border border-line bg-panel p-5 shadow-neon">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted">
            Incident Detail
          </p>
          <h2 className="mt-2 text-lg font-semibold text-text">
            {event.eventType}
          </h2>
          <p className="mt-1 text-sm text-muted">{event.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span
            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${severityTone(event.severity)}`}
          >
            {event.severity}
          </span>
          <span
            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusTone(event.status)}`}
          >
            {event.status}
          </span>
        </div>
      </div>

      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted">Timestamp</dt>
          <dd className="text-text">{formatTimestamp(event.timestamp)}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted">Source IP</dt>
          <dd className="font-mono text-neon">{event.sourceIp}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted">Destination</dt>
          <dd className="text-text">{event.destination}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted">Protocol / Port</dt>
          <dd className="text-text">
            {event.protocol} / {event.port === 0 ? "N/A" : event.port}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted">Detection Rule</dt>
          <dd className="text-right text-text">{event.rule}</dd>
        </div>
      </dl>

      <div className="mt-5 space-y-3">
        <label className="block text-xs uppercase tracking-[0.25em] text-muted">
          Analyst Notes
        </label>
        <textarea
          value={event.notes}
          onChange={(e) => onNotesChange(event.id, e.target.value)}
          className="min-h-36 w-full rounded-xl border border-line bg-panelAlt px-4 py-3 text-sm text-text outline-none transition placeholder:text-muted focus:border-neon"
          placeholder="Record containment steps, assumptions, or next actions..."
        />
      </div>

      <button
        type="button"
        onClick={() => onToggleReviewed(event.id)}
        className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-neon/30 bg-neon/10 px-4 py-3 text-sm font-medium text-neon transition hover:bg-neon/20"
      >
        Mark as {event.status === "Reviewed" ? "Open" : "Reviewed"}
      </button>
    </aside>
  );
}
