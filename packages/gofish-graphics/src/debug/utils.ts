import type { DebugData } from "./types";

export function saveDebugData(data: DebugData, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function loadDebugData(json: string): DebugData {
  const parsed = JSON.parse(json);
  if (!parsed.snapshot || !parsed.events) {
    throw new Error(
      "Invalid debug data: expected { snapshot: DebugSnapshot, events: DebugEventLog }"
    );
  }
  return parsed as DebugData;
}

export function debugDataToJson(data: DebugData): string {
  return JSON.stringify(data, null, 2);
}
