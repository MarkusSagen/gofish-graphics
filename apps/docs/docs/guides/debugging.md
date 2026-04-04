# Debugging & Inspecting Charts

GoFish includes a built-in debug inspector that lets you see exactly how your chart is composed — the AST tree, each node's dimensions and bounds, the underlying coordinate spaces, and the events from every rendering pass.

This is invaluable when you're asking questions like:

- **"Why does this look wrong?"** — inspect bounding boxes and transforms to see where space is allocated
- **"How is this composed?"** — walk the AST tree to see how operators nest shapes
- **"What happened at each pass?"** — review the event log to trace rendering decisions

## Quick Start

The fastest way to debug a chart is to swap `.render()` for `.debug()`, then pass the result to `inspect()`:

```ts
import { Chart, spread, rect, inspect } from "gofish-graphics";

const data = [
  { category: "A", value: 28 },
  { category: "B", value: 55 },
  { category: "C", value: 43 },
];

// Instead of .render(container, { w: 400, h: 300 })
const debugData = await Chart(data)
  .flow(spread("category", { dir: "x" }))
  .mark(rect({ h: "value" }))
  .debug({ w: 400, h: 300 });

// Create the interactive inspector widget
const inspector = inspect(debugData);
document.body.appendChild(inspector);
```

The `.debug()` method runs the full rendering pipeline — all passes from color scales through layout and placement — but instead of producing SVG output, it captures a **snapshot** of the AST tree and an **event log** of what happened at each pass. The `inspect()` function turns that data into an interactive HTML widget.

## The Inspector Widget

The inspector is a tabbed panel with two views (more coming in future releases):

### Tree Tab

<img src="/images/debug/inspector-tree-tab.png" alt="Debug inspector tree tab showing the AST tree with a spread operator containing rect shapes" style="border-radius:8px;border:1px solid #334155;max-width:100%" />

The Tree tab shows the full AST tree on the left and a detail panel on the right.

**Tree panel (left):**

- Nodes are color-coded by category: **operators** (amber), **shapes** (green), **transforms** (blue), **refs** (gray)
- Click the arrow to expand/collapse children
- Click a node to select it and see its details

**Detail panel (right):**
When you select a node, the detail panel shows:

| Section              | What it tells you                                                                                                       |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Identity**         | Node type, unique ID, name (if set via `.name()`), key                                                                  |
| **Dimensions**       | Intrinsic size on x and y axes, whether embedded or shared                                                              |
| **Transform**        | Translation offset from parent                                                                                          |
| **Global Bounds**    | Position and size in root coordinate space — this is what determines where things appear on screen                      |
| **Underlying Space** | The coordinate space type (POSITION, ORDINAL, SIZE) and domain for each axis                                            |
| **Data Binding**     | If the node maps a data field (like `h: "count"`), shows the field name, raw value, mapped value, and scale description |
| **Color**            | Raw color value and resolved hex                                                                                        |

**Breadcrumb navigation:** The breadcrumb bar at the top shows the path from the root to the selected node, making it easy to understand nesting.

Here's a deeper example with a stacked bar chart, showing how the tree reveals nested operators and per-node details like color resolution and underlying space:

<img src="/images/debug/inspector-stacked-detail.png" alt="Debug inspector showing a stacked bar chart with a rect node selected, displaying identity, dimensions, bounds, underlying space, and color info" style="border-radius:8px;border:1px solid #334155;max-width:100%" />

### Snapshot Tab

<img src="/images/debug/inspector-snapshot-tab.png" alt="Debug inspector snapshot tab showing syntax-highlighted JSON" style="border-radius:8px;border:1px solid #334155;max-width:100%" />

The Snapshot tab displays the complete debug data as syntax-highlighted JSON. This is the raw data structure that powers the Tree tab.

**Actions:**

- **Copy** — copies the full JSON to your clipboard
- **Download** — saves as a `.json` file for later analysis or sharing

The JSON format is the cross-language contract — the same structure will be used by Python, Jupyter, and other language bindings.

## SVG Bounding Box Overlays

For a visual overlay directly on your chart, use `renderBoundingBoxOverlay()`:

```ts
import { renderBoundingBoxOverlay } from "gofish-graphics";

const debugData = await Chart(data)
  .flow(spread("category", { dir: "x" }))
  .mark(rect({ h: "value" }))
  .debug({ w: 400, h: 300 });

// Get SVG overlay markup
const overlaySvg = renderBoundingBoxOverlay(debugData.snapshot);

// Append to an SVG element
svgElement.innerHTML += overlaySvg;
```

<img src="/images/debug/bounding-box-overlay.png" alt="SVG bounding box overlay showing color-coded dashed rectangles around chart elements" style="border-radius:8px;border:1px solid #334155;max-width:100%" />

The overlay draws dashed rectangles around every node in the AST:

- **Amber dashed lines** — operators (spread, stack, etc.) with labels showing type and size
- **Green dashed lines** — shapes (rect, circle, etc.)
- **Blue dashed lines** — coordinate transforms
- **Gray dashed lines** — refs

Hover over any box to see a tooltip with the node's type, name, and dimensions.

## Saving and Loading Debug Data

Debug snapshots can be saved for later analysis or shared with collaborators:

```ts
import { saveDebugData, loadDebugData, debugDataToJson } from "gofish-graphics";

// Save to a file (triggers browser download)
saveDebugData(debugData, "my-chart-debug.json");

// Convert to JSON string (for programmatic use)
const jsonString = debugDataToJson(debugData);

// Load from a JSON string
const loaded = loadDebugData(jsonString);
const inspector = inspect(loaded);
```

## Cross-Environment Usage

### Jupyter / Marimo (Python)

The `inspectHtml()` function returns a **self-contained HTML string** with all styles and interactivity inlined — no external dependencies. This makes it work in any environment that can display HTML:

```ts
import { inspectHtml } from "gofish-graphics";

const html = inspectHtml(debugData);
// Returns a complete HTML document with inline <script>
```

In Python (once the Python bindings are available):

```python
from gofish import Chart, spread, rect

debug_data = (
    Chart(data)
    .flow(spread("category", dir="x"))
    .mark(rect(h="value"))
    .debug(w=400, h=300)
)

# In Jupyter/Marimo — displays as interactive HTML widget
debug_data.inspect()
```

The HTML inspector uses vanilla JavaScript (no framework dependencies) to ensure maximum portability across notebook environments.

### JSON as the Cross-Language Contract

The debug data format is a simple JSON structure with two top-level keys:

```json
{
  "snapshot": {
    "version": 1,
    "timestamp": 1234567890,
    "renderOptions": { "w": 400, "h": 300 },
    "tree": { "uid": "node-0", "type": "spread", "...": "..." },
    "scales": { "color": {}, "position": {}, "ordinal": {} }
  },
  "events": {
    "version": 1,
    "events": [
      {
        "pass": "colorScale",
        "nodeUid": "node-0",
        "message": "...",
        "timestamp": 0
      },
      {
        "pass": "layout",
        "nodeUid": "node-1",
        "message": "...",
        "timestamp": 5
      }
    ]
  }
}
```

Any language that can parse JSON and render HTML can build its own inspector from this data. The TypeScript types are the authoritative schema — see the [API reference](/api/debug/) for full type definitions.

## Understanding the Rendering Pipeline

GoFish renders charts through a series of passes. The debug event log captures what happens at each one:

| Pass                | What it does                                   | What to look for                                           |
| ------------------- | ---------------------------------------------- | ---------------------------------------------------------- |
| **colorScale**      | Assigns colors based on data field mappings    | Color assignments, palette/gradient selection              |
| **names**           | Registers named marks (`.name("bars")`)        | Which marks are named, for cross-chart selection           |
| **keys**            | Assigns keys for axes labels                   | Key values that become axis tick labels                    |
| **sizeDomains**     | Calculates min/max data ranges for sizing      | Domain ranges — if a bar seems wrong height, check here    |
| **underlyingSpace** | Determines coordinate space type per axis      | POSITION vs ORDINAL vs SIZE — affects how layout works     |
| **posScales**       | Creates position scales (data → pixel mapping) | Scale domains and ranges                                   |
| **layout**          | Calculates node sizes and positions            | Allocated widths/heights — the "why is it this size?" pass |
| **placement**       | Final positioning with parent transforms       | Global coordinates — the "why is it here?" pass            |

When debugging a visual issue, start by finding the node in the **Tree tab**, then look at its **Global Bounds** (placement result) and **Dimensions** (layout result). If those look wrong, check the **Underlying Space** to see if the coordinate system is what you expect.

## Options

### `inspect()` Options

```ts
inspect(debugData, {
  theme: "dark", // "dark" | "light" | "auto" (default: "dark")
  defaultTab: "tree", // "tree" | "snapshot" (default: "tree")
  width: "100%", // CSS width (default: "100%")
  height: "600px", // CSS height (default: "600px")
});
```

### `.debug()` Options

```ts
chart(data).flow(/* ... */).mark(/* ... */).debug({
  w: 400, // Width in pixels (required)
  h: 300, // Height in pixels (required)
  padding: 20, // Padding around chart (optional)
});
```

## Architecture

The debug system has three layers with clear boundaries:

```
┌─────────────────────────────────────────────────┐
│  Engine Layer (packages/gofish-graphics/src/ast) │
│                                                   │
│  DebugCollector ← attached to RenderSession       │
│  emit() called after each rendering pass          │
│                                                   │
│  Serializer bridges engine internals →            │
│  DebugSnapshot + DebugEventLog (JSON)             │
├─────────────────────────────────────────────────┤
│  JSON Contract (debug/types.ts)                   │
│  DebugData = { snapshot, events }                 │
│  No engine dependencies — pure data              │
├─────────────────────────────────────────────────┤
│  Presentation Layer (debug/inspector/)            │
│                                                   │
│  inspect() → HTMLElement (browser)                │
│  inspectHtml() → string (Jupyter/Marimo)          │
│  renderBoundingBoxOverlay() → SVG string          │
│                                                   │
│  No engine imports — works from JSON alone        │
└─────────────────────────────────────────────────┘
```

The JSON contract is the boundary between the engine and the presentation. This means:

- The inspector can be used standalone with saved JSON files
- Other languages only need to produce/consume JSON — no engine bindings required
- The inspector widget has zero framework dependencies (vanilla HTML/CSS/JS)

## Next Steps

- Browse the [API reference](/api/debug/) for detailed function signatures
- Check out the [Storybook stories](http://localhost:6006/?path=/story/debug-inspector) for interactive examples
- Save debug data from your charts and compare snapshots to understand how changes affect the rendering
