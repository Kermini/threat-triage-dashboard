import { SecurityEvent } from "../types";
import { formatTimestamp, severityTone, statusTone } from "../lib/format";

interface EventTableProps {
  events: SecurityEvent[];
  selectedId: string | null;
  onSelect: (event: SecurityEvent) => void;
}

export function EventTable({ events, selectedId, onSelect }: EventTableProps) {
  return (
    <section className="rounded-xl border border-line bg-panel shadow-neon">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-text">Active Events</h2>
          <p className="text-xs text-muted">
            Review inbound alerts, suspicious IPs, and analyst notes.
          </p>
        </div>
        <p className="text-xs uppercase tracking-[0.25em] text-muted">
          {events.length} visible
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-line text-left text-sm">
          <thead className="bg-panelAlt text-xs uppercase tracking-[0.18em] text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Timestamp</th>
              <th className="px-4 py-3 font-medium">Source IP</th>
              <th className="px-4 py-3 font-medium">Event Type</th>
              <th className="px-4 py-3 font-medium">Severity</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {events.map((event) => {
              const selected = event.id === selectedId;

              return (
                <tr
                  key={event.id}
                  onClick={() => onSelect(event)}
                  className={`cursor-pointer transition ${
                    selected ? "bg-neon/10" : "hover:bg-panelAlt"
                  }`}
                >
                  <td className="whitespace-nowrap px-4 py-3 text-muted">
                    {formatTimestamp(event.timestamp)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-neon">
                    {event.sourceIp}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-text">
                    {event.eventType}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${severityTone(event.severity)}`}
                    >
                      {event.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusTone(event.status)}`}
                    >
                      {event.status}
                    </span>
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-muted">
                    {event.notes || "No analyst notes yet"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
