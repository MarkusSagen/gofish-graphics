# Save & Load Debug Data

Utilities for persisting and sharing debug snapshots. Save debug data as JSON files for later analysis, comparison, or sharing with collaborators.

## saveDebugData

Triggers a browser download of the debug data as a JSON file.

### Signature

```ts
saveDebugData(data: DebugData, filename: string): void
```

### Parameters

| Parameter  | Type        | Description                                           |
| ---------- | ----------- | ----------------------------------------------------- |
| `data`     | `DebugData` | Debug data from `.debug()`                            |
| `filename` | `string`    | Name for the downloaded file (e.g. `"my-chart.json"`) |

### Example

```ts
import { Chart, spread, rect, saveDebugData } from "gofish-graphics";

const debugData = await Chart(data)
  .flow(spread("category", { dir: "x" }))
  .mark(rect({ h: "value" }))
  .debug({ w: 400, h: 300 });

saveDebugData(debugData, "bar-chart-debug.json");
// Browser downloads "bar-chart-debug.json"
```

## loadDebugData

Parses a JSON string and returns typed `DebugData`. Validates that the required top-level structure (`snapshot` and `events`) is present.

### Signature

```ts
loadDebugData(json: string): DebugData
```

### Parameters

| Parameter | Type     | Description          |
| --------- | -------- | -------------------- |
| `json`    | `string` | JSON string to parse |

### Throws

`Error` if the JSON is missing the required `snapshot` or `events` keys.

### Example

```ts
import { loadDebugData, inspect } from "gofish-graphics";

// Load from a file input
fileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  const text = await file.text();
  const debugData = loadDebugData(text);

  const inspector = inspect(debugData);
  document.body.appendChild(inspector);
});
```

### Example: Load from fetch

```ts
const response = await fetch("/debug-snapshots/chart-v2.json");
const json = await response.text();
const debugData = loadDebugData(json);
```

## debugDataToJson

Serializes debug data to a formatted JSON string. Convenience wrapper around `JSON.stringify` with 2-space indentation.

### Signature

```ts
debugDataToJson(data: DebugData): string
```

### Parameters

| Parameter | Type        | Description             |
| --------- | ----------- | ----------------------- |
| `data`    | `DebugData` | Debug data to serialize |

### Example

```ts
import { debugDataToJson } from "gofish-graphics";

const json = debugDataToJson(debugData);
console.log(json);
// Pretty-printed JSON string

// Store in localStorage
localStorage.setItem("lastDebug", json);

// Send to a server
fetch("/api/debug", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: json,
});
```

## Workflow: Compare Before & After

A practical pattern for debugging layout changes:

```ts
import { Chart, spread, rect, saveDebugData } from "gofish-graphics";

// Capture "before" state
const before = await Chart(data)
  .flow(spread("category", { dir: "x" }))
  .mark(rect({ h: "value" }))
  .debug({ w: 400, h: 300 });

saveDebugData(before, "before.json");

// Make changes to chart spec...

const after = await Chart(data)
  .flow(spread("category", { dir: "x" }))
  .mark(rect({ h: "value", w: 20 })) // Added explicit width
  .debug({ w: 400, h: 300 });

saveDebugData(after, "after.json");

// Now you can diff the two JSON files to see exactly what changed
```
