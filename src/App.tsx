import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartPanel } from "./components/ChartPanel";
import { EventTable } from "./components/EventTable";
import { IncidentPanel } from "./components/IncidentPanel";
import { OverviewCard } from "./components/OverviewCard";
import {
  countFailedLogins,
  eventsOverTime,
  highSeverityAlerts,
  severityChartData,
  topSourceIps,
  uniqueSourceIps,
} from "./lib/analytics";
import { parseImportedEvents } from "./lib/parsers";
import { loadEvents, saveEvents } from "./lib/storage";
import { EventFilters, SecurityEvent } from "./types";
import { mockEvents } from "./data/mockEvents";

const severityColors: Record<string, string> = {
  Critical: "#ef4444",
  High: "#f97316",
  Medium: "#facc15",
  Low: "#2dd4bf",
};

const defaultFilters: EventFilters = {
  severity: "All",
  eventType: "All",
  ipSearch: "",
};

export default function App() {
  const [events, setEvents] = useState<SecurityEvent[]>(() => loadEvents());
  const [filters, setFilters] = useState<EventFilters>(defaultFilters);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [importError, setImportError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    saveEvents(events);
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSeverity =
        filters.severity === "All" || event.severity === filters.severity;
      const matchesType =
        filters.eventType === "All" || event.eventType === filters.eventType;
      const matchesIp = event.sourceIp
        .toLowerCase()
        .includes(filters.ipSearch.toLowerCase());

      return matchesSeverity && matchesType && matchesIp;
    });
  }, [events, filters]);

  useEffect(() => {
    if (!filteredEvents.length) {
      setSelectedId(null);
      return;
    }

    const selectedStillExists = filteredEvents.some(
      (event) => event.id === selectedId,
    );

    if (!selectedStillExists) {
      setSelectedId(filteredEvents[0].id);
    }
  }, [filteredEvents, selectedId]);

  const selectedEvent =
    filteredEvents.find((event) => event.id === selectedId) ?? null;

  const eventTypes = useMemo(
    () =>
      [...new Set(events.map((event) => event.eventType))].sort((a, b) =>
        a.localeCompare(b),
      ),
    [events],
  );

  const handleNotesChange = (id: string, notes: string) => {
    setEvents((current) =>
      current.map((event) => (event.id === id ? { ...event, notes } : event)),
    );
  };

  const handleToggleReviewed = (id: string) => {
    setEvents((current) =>
      current.map((event) =>
        event.id === id
          ? {
              ...event,
              status: event.status === "Reviewed" ? "Open" : "Reviewed",
            }
          : event,
      ),
    );
  };

  const handleImport = async (file: File | null) => {
    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const importedEvents = parseImportedEvents(file.name, text);
      setEvents(importedEvents);
      setImportError("");
      setFilters(defaultFilters);
      setSelectedId(importedEvents[0]?.id ?? null);
    } catch (error) {
      setImportError(
        error instanceof Error ? error.message : "Unable to import file.",
      );
    }
  };

  const handleResetDataset = () => {
    setEvents(mockEvents);
    setFilters(defaultFilters);
    setSelectedId(mockEvents[0]?.id ?? null);
    setImportError("");
  };

  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.18),transparent_35%)]" />
      <div className="fixed inset-0 -z-10 bg-grid bg-[size:52px_52px] opacity-20" />

      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <header className="border-b border-line pb-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.35em] text-neon">
                Threat Triage Dashboard
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-text sm:text-4xl">
                SOC-style event review for Azure and Sentinel-flavored alerts
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
                Review suspicious IP activity, failed logins, denied traffic,
                and brute-force patterns with a dark operations-focused
                workspace backed by local storage.
              </p>
            </div>

            <div className="grid gap-3 text-sm text-muted sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-xl border border-line bg-panel px-4 py-3">
                <p className="text-xs uppercase tracking-[0.25em]">Source</p>
                <p className="mt-2 text-text">Mock Sentinel Feed</p>
              </div>
              <div className="rounded-xl border border-line bg-panel px-4 py-3">
                <p className="text-xs uppercase tracking-[0.25em]">State</p>
                <p className="mt-2 text-text">LocalStorage</p>
              </div>
              <div className="rounded-xl border border-line bg-panel px-4 py-3">
                <p className="text-xs uppercase tracking-[0.25em]">Scope</p>
                <p className="mt-2 text-text">MVP Analyst View</p>
              </div>
              <div className="rounded-xl border border-line bg-panel px-4 py-3">
                <p className="text-xs uppercase tracking-[0.25em]">Mode</p>
                <p className="mt-2 text-text">Triage Active</p>
              </div>
              <div className="rounded-xl border border-line bg-panel px-4 py-3 sm:col-span-2 xl:col-span-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em]">
                      Import Logs
                    </p>
                    <p className="mt-2 text-text">
                      Load local `.json` or `.csv` events into the dashboard.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json,.csv"
                      className="hidden"
                      onChange={(e) =>
                        handleImport(e.target.files?.[0] ?? null).finally(() => {
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-xl border border-neon/30 bg-neon/10 px-4 py-3 text-sm text-neon transition hover:bg-neon/20"
                    >
                      Import JSON / CSV
                    </button>
                    <button
                      type="button"
                      onClick={handleResetDataset}
                      className="rounded-xl border border-line px-4 py-3 text-sm text-muted transition hover:border-neon hover:text-neon"
                    >
                      Restore Sample Feed
                    </button>
                  </div>
                </div>
                {importError ? (
                  <p className="mt-3 text-sm text-alert">{importError}</p>
                ) : (
                  <p className="mt-3 text-xs text-muted">
                    Expected fields: `timestamp`, `sourceIp`, `eventType`,
                    `severity`, `status`, `notes`, `destination`, `protocol`,
                    `port`, `description`, `rule`.
                  </p>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="mt-6 space-y-6">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <OverviewCard
              label="Total Events"
              value={filteredEvents.length}
              hint="All visible alerts after active filters."
            />
            <OverviewCard
              label="High Severity Alerts"
              value={highSeverityAlerts(filteredEvents)}
              hint="High and critical issues needing priority review."
            />
            <OverviewCard
              label="Unique Source IPs"
              value={uniqueSourceIps(filteredEvents)}
              hint="Distinct external sources seen in this window."
            />
            <OverviewCard
              label="Failed Login Attempts"
              value={countFailedLogins(filteredEvents)}
              hint="Authentication failures across RDP, SSH, and SQL."
            />
          </section>

          <section className="rounded-xl border border-line bg-panel p-4 shadow-neon">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <label className="text-sm">
                <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-muted">
                  Severity
                </span>
                <select
                  value={filters.severity}
                  onChange={(e) =>
                    setFilters((current) => ({
                      ...current,
                      severity: e.target.value as EventFilters["severity"],
                    }))
                  }
                  className="w-full rounded-xl border border-line bg-panelAlt px-4 py-3 text-text outline-none focus:border-neon"
                >
                  <option value="All">All severities</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </label>

              <label className="text-sm">
                <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-muted">
                  Event Type
                </span>
                <select
                  value={filters.eventType}
                  onChange={(e) =>
                    setFilters((current) => ({
                      ...current,
                      eventType: e.target.value as EventFilters["eventType"],
                    }))
                  }
                  className="w-full rounded-xl border border-line bg-panelAlt px-4 py-3 text-text outline-none focus:border-neon"
                >
                  <option value="All">All event types</option>
                  {eventTypes.map((eventType) => (
                    <option key={eventType} value={eventType}>
                      {eventType}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm xl:col-span-2">
                <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-muted">
                  Search by IP
                </span>
                <div className="flex gap-3">
                  <input
                    value={filters.ipSearch}
                    onChange={(e) =>
                      setFilters((current) => ({
                        ...current,
                        ipSearch: e.target.value,
                      }))
                    }
                    placeholder="185.220.101.14"
                    className="w-full rounded-xl border border-line bg-panelAlt px-4 py-3 font-mono text-text outline-none placeholder:text-muted focus:border-neon"
                  />
                  <button
                    type="button"
                    onClick={() => setFilters(defaultFilters)}
                    className="rounded-xl border border-line px-4 py-3 text-sm text-muted transition hover:border-neon hover:text-neon"
                  >
                    Reset
                  </button>
                </div>
              </label>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-3">
            <ChartPanel
              title="Events by Severity"
              subtitle="Quick spread of criticality inside the visible set."
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={severityChartData(filteredEvents)}>
                  <CartesianGrid stroke="#1e3550" strokeDasharray="4 4" />
                  <XAxis dataKey="severity" stroke="#7f9bb8" tickLine={false} />
                  <YAxis stroke="#7f9bb8" tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: "rgba(45, 212, 191, 0.08)" }}
                    contentStyle={{
                      backgroundColor: "#0c1726",
                      border: "1px solid #1e3550",
                      borderRadius: "12px",
                      color: "#d7e6ff",
                    }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {severityChartData(filteredEvents).map((entry) => (
                      <Cell
                        key={entry.severity}
                        fill={severityColors[entry.severity]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartPanel>

            <ChartPanel
              title="Events Over Time"
              subtitle="Burst visibility for spikes in the incident window."
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={eventsOverTime(filteredEvents)}>
                  <CartesianGrid stroke="#1e3550" strokeDasharray="4 4" />
                  <XAxis dataKey="time" stroke="#7f9bb8" tickLine={false} />
                  <YAxis stroke="#7f9bb8" tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0c1726",
                      border: "1px solid #1e3550",
                      borderRadius: "12px",
                      color: "#d7e6ff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#2dd4bf"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#2dd4bf" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartPanel>

            <ChartPanel
              title="Top Source IPs"
              subtitle="Most persistent sources in the current dataset."
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topSourceIps(filteredEvents)} layout="vertical">
                  <CartesianGrid stroke="#1e3550" strokeDasharray="4 4" />
                  <XAxis type="number" stroke="#7f9bb8" tickLine={false} />
                  <YAxis
                    dataKey="ip"
                    type="category"
                    width={100}
                    stroke="#7f9bb8"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0c1726",
                      border: "1px solid #1e3550",
                      borderRadius: "12px",
                      color: "#d7e6ff",
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 8, 8, 0]} fill="#60a5fa" />
                </BarChart>
              </ResponsiveContainer>
            </ChartPanel>
          </section>

          <section className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_380px]">
            <EventTable
              events={filteredEvents}
              selectedId={selectedId}
              onSelect={(event) => setSelectedId(event.id)}
            />
            <IncidentPanel
              event={selectedEvent}
              onNotesChange={handleNotesChange}
              onToggleReviewed={handleToggleReviewed}
            />
          </section>
        </main>
      </div>
    </div>
  );
}
