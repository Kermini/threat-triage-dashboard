import { SecurityEvent, Severity } from "../types";

const allowedSeverities: Severity[] = ["Critical", "High", "Medium", "Low"];

function inferSeverity(eventType: SecurityEvent["eventType"]): Severity {
  switch (eventType) {
    case "Brute Force":
    case "Malware Beacon":
      return "High";
    case "Suspicious IP":
      return "Medium";
    case "Port Scan":
    case "Failed Login":
      return "Medium";
    default:
      return "Low";
  }
}

function normalizeEvent(input: Partial<SecurityEvent>, index: number): SecurityEvent {
  const eventType =
    input.eventType && [
      "Failed Login",
      "Denied Traffic",
      "Suspicious IP",
      "Brute Force",
      "Port Scan",
      "Malware Beacon",
    ].includes(input.eventType)
      ? input.eventType
      : "Suspicious IP";

  const severity =
    input.severity && allowedSeverities.includes(input.severity)
      ? input.severity
      : inferSeverity(eventType);

  return {
    id: input.id || `import-${Date.now()}-${index}`,
    timestamp: input.timestamp || new Date().toISOString(),
    sourceIp: input.sourceIp || "0.0.0.0",
    destination: input.destination || "unknown-target",
    eventType,
    severity,
    status: input.status === "Reviewed" ? "Reviewed" : "Open",
    protocol:
      input.protocol && ["RDP", "SSH", "SMB", "HTTP", "HTTPS", "ICMP", "SQL"].includes(input.protocol)
        ? input.protocol
        : "HTTPS",
    port: Number.isFinite(input.port) ? Number(input.port) : 443,
    notes: input.notes || "",
    description: input.description || "Imported security event.",
    rule: input.rule || "Imported Log Rule",
  };
}

function parseJson(text: string): SecurityEvent[] {
  const parsed = JSON.parse(text);
  if (!Array.isArray(parsed)) {
    throw new Error("JSON import must be an array of events.");
  }

  return parsed.map((item, index) => normalizeEvent(item, index));
}

function parseCsv(text: string): SecurityEvent[] {
  const [headerLine, ...rows] = text.trim().split(/\r?\n/);
  const headers = headerLine.split(",").map((value) => value.trim());

  return rows
    .filter(Boolean)
    .map((row, index) => {
      const values = row.split(",").map((value) => value.trim());
      const record = headers.reduce<Record<string, string>>((acc, header, position) => {
        acc[header] = values[position] ?? "";
        return acc;
      }, {});

      return normalizeEvent(
        {
          id: record.id,
          timestamp: record.timestamp,
          sourceIp: record.sourceIp,
          destination: record.destination,
          eventType: record.eventType as SecurityEvent["eventType"],
          severity: record.severity as Severity,
          status: record.status as SecurityEvent["status"],
          protocol: record.protocol as SecurityEvent["protocol"],
          port: Number(record.port),
          notes: record.notes,
          description: record.description,
          rule: record.rule,
        },
        index,
      );
    });
}

export function parseImportedEvents(fileName: string, text: string): SecurityEvent[] {
  if (fileName.toLowerCase().endsWith(".json")) {
    return parseJson(text);
  }

  if (fileName.toLowerCase().endsWith(".csv")) {
    return parseCsv(text);
  }

  throw new Error("Only .json and .csv files are supported in the MVP.");
}
