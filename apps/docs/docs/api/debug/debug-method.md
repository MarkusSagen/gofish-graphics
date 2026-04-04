# .debug()

Runs the full rendering pipeline on a chart and returns a `DebugData` object containing the AST snapshot and event log. This is the entry point for all debug/inspection workflows.

## Signature

```ts
chartBuilder.debug(options): Promise<DebugData>
```

## Parameters

| Parameter         | Type     | Description                                 |
| ----------------- | -------- | ------------------------------------------- |
| `options.w`       | `number` | **Required.** Width of the chart in pixels  |
| `options.h`       | `number` | **Required.** Height of the chart in pixels |
| `options.padding` | `number` | Optional padding around the chart           |

Returns a `Promise<DebugData>` containing the snapshot and event log.

## How It Works

`.debug()` performs the same rendering passes as `.render()`:

1. **colorScale** — assigns colors from palette/gradient
2. **names** — registers named marks
3. **keys** — assigns axis label keys
4. **sizeDomains** — calculates data domain ranges
5. **underlyingSpace** — determines coordinate space types
6. **posScales** — creates data-to-pixel scale functions
7. **layout** — calculates sizes and positions
8. **placement** — applies parent transforms for final positioning

Instead of producing SVG, it captures the state of every node after all passes complete, plus an event log recording what happened at each pass.

## Examples

### Basic usage

```ts
import { Chart, spread, rect } from "gofish-graphics";

const debugData = await Chart(data)
  .flow(spread("category", { dir: "x" }))
  .mark(rect({ h: "value" }))
  .debug({ w: 400, h: 300 });

console.log(debugData.snapshot.tree.type);
// => "spread"

console.log(debugData.snapshot.tree.children.length);
// => number of categories in data

console.log(debugData.events.events.length);
// => total number of events across all passes
```

### With padding

```ts
const debugData = await Chart(data)
  .flow(spread("category", { dir: "x" }))
  .mark(rect({ h: "value" }))
  .debug({ w: 600, h: 400, padding: 40 });

console.log(debugData.snapshot.renderOptions);
// => { w: 600, h: 400, padding: 40 }
```

### Chaining with inspect

The most common pattern is to pipe `.debug()` directly into [`inspect()`](/api/debug/inspect):

```ts
const debugData = await Chart(data)
  .flow(spread("category", { dir: "x" }))
  .mark(rect({ h: "value" }))
  .debug({ w: 400, h: 300 });

const inspectorElement = inspect(debugData);
document.body.appendChild(inspectorElement);
```

### Filtering events by pass

```ts
const debugData = await Chart(data)
  .flow(spread("category", { dir: "x" }))
  .mark(rect({ h: "value" }))
  .debug({ w: 400, h: 300 });

// See what happened during the layout pass
const layoutEvents = debugData.events.events.filter((e) => e.pass === "layout");

layoutEvents.forEach((e) => {
  console.log(`${e.nodeType} (${e.nodeUid}): ${e.message}`);
});
```

### Comparing two charts

```ts
const debugA = await Chart(dataA)
  .flow(spread("x", { dir: "x" }))
  .mark(rect({ h: "y" }))
  .debug({ w: 400, h: 300 });

const debugB = await Chart(dataB)
  .flow(spread("x", { dir: "x" }))
  .mark(rect({ h: "y" }))
  .debug({ w: 400, h: 300 });

// Compare tree structures
console.log("A nodes:", countNodes(debugA.snapshot.tree));
console.log("B nodes:", countNodes(debugB.snapshot.tree));

function countNodes(node) {
  return 1 + node.children.reduce((sum, c) => sum + countNodes(c), 0);
}
```

## Return Value

See [DebugData](/api/debug/#debugdata) for the full type definition. The key parts:

- `snapshot.tree` — root `DebugNode` of the AST
- `snapshot.scales` — color mappings and axis scales
- `snapshot.renderOptions` — the options you passed to `.debug()`
- `events.events` — ordered array of `DebugEvent` objects
