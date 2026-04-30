export type Severity = "Critical" | "High" | "Medium" | "Low";
export type EventStatus = "Open" | "Reviewed";

export interface SecurityEvent {
  id: string;
  timestamp: string;
  sourceIp: string;
  destination: string;
  eventType:
    | "Failed Login"
    | "Denied Traffic"
    | "Suspicious IP"
    | "Brute Force"
    | "Port Scan"
    | "Malware Beacon";
  severity: Severity;
  status: EventStatus;
  protocol: "RDP" | "SSH" | "SMB" | "HTTP" | "HTTPS" | "ICMP" | "SQL";
  port: number;
  notes: string;
  description: string;
  rule: string;
}

export interface EventFilters {
  severity: "All" | Severity;
  eventType: "All" | SecurityEvent["eventType"];
  ipSearch: string;
}
