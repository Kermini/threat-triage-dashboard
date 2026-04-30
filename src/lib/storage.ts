import { mockEvents } from "../data/mockEvents";
import { SecurityEvent } from "../types";

const STORAGE_KEY = "threat-triage-events-v1";

export function loadEvents(): SecurityEvent[] {
  if (typeof window === "undefined") {
    return mockEvents;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mockEvents));
    return mockEvents;
  }

  try {
    return JSON.parse(raw) as SecurityEvent[];
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mockEvents));
    return mockEvents;
  }
}

export function saveEvents(events: SecurityEvent[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}
