# Threat Triage Dashboard

A dark SOC-style React dashboard for reviewing security events locally with no backend.

## Stack

- React + TypeScript
- Tailwind CSS
- Recharts
- LocalStorage

## MVP Features

- Overview cards for total events, high severity alerts, unique source IPs, and failed logins
- Filterable event table with analyst notes and review status
- Charts for events by severity, events over time, and top source IPs
- Incident detail panel for triage workflow
- Mock Azure/Sentinel-style security data
- Local JSON/CSV import support

## Run Locally

```bash
npm install
npm run dev
```

## Import Format

Supported file types:

- `.json` with an array of event objects
- `.csv` with headers matching:

```text
timestamp,sourceIp,eventType,severity,status,notes,destination,protocol,port,description,rule
```

## Notes

- Analyst notes and reviewed status persist in LocalStorage.
- The "Restore Sample Feed" button resets the seeded mock dataset.
