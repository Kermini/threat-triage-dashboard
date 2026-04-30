export function formatTimestamp(timestamp: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export function severityTone(severity: string) {
  switch (severity) {
    case "Critical":
      return "text-danger border-danger/30 bg-danger/10";
    case "High":
      return "text-alert border-alert/30 bg-alert/10";
    case "Medium":
      return "text-warn border-warn/30 bg-warn/10";
    default:
      return "text-neon border-neon/30 bg-neon/10";
  }
}

export function statusTone(status: string) {
  return status === "Reviewed"
    ? "text-safe border-safe/30 bg-safe/10"
    : "text-muted border-line bg-panelAlt";
}
