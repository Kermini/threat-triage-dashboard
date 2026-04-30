import { SecurityEvent } from "../types";

export function countFailedLogins(events: SecurityEvent[]) {
  return events.filter((event) => event.eventType === "Failed Login").length;
}

export function uniqueSourceIps(events: SecurityEvent[]) {
  return new Set(events.map((event) => event.sourceIp)).size;
}

export function highSeverityAlerts(events: SecurityEvent[]) {
  return events.filter(
    (event) => event.severity === "High" || event.severity === "Critical",
  ).length;
}

export function severityChartData(events: SecurityEvent[]) {
  const counts = new Map<string, number>();

  events.forEach((event) => {
    counts.set(event.severity, (counts.get(event.severity) ?? 0) + 1);
  });

  return ["Critical", "High", "Medium", "Low"].map((severity) => ({
    severity,
    count: counts.get(severity) ?? 0,
  }));
}

export function topSourceIps(events: SecurityEvent[]) {
  const counts = new Map<string, number>();

  events.forEach((event) => {
    counts.set(event.sourceIp, (counts.get(event.sourceIp) ?? 0) + 1);
  });

  return [...counts.entries()]
    .map(([ip, count]) => ({ ip, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

export function eventsOverTime(events: SecurityEvent[]) {
  const counts = new Map<string, number>();

  events.forEach((event) => {
    const key = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(event.timestamp));

    counts.set(key, (counts.get(key) ?? 0) + 1);
  });

  return [...counts.entries()]
    .map(([time, count]) => ({ time, count }))
    .sort((a, b) => a.time.localeCompare(b.time));
}
