# SVG Overlays

Visual overlays rendered as SVG that can be layered on top of your charts to show bounding boxes, node boundaries, and structural information.

## renderBoundingBoxOverlay

Generates an SVG `<g>` element string containing dashed rectangles for every node in the AST tree. The rectangles show each node's `globalBounds` — the final position and size after all rendering passes.

### Signature

```ts
renderBoundingBoxOverlay(snapshot: DebugSnapshot): string
```

### Parameters

| Parameter  | Type            | Description                            |
| ---------- | --------------- | -------------------------------------- |
| `snapshot` | `DebugSnapshot` | The snapshot from `DebugData.snapshot` |

Returns an SVG group (`<g>`) as a string.

### Color Coding

| Category                            | Color             | Stroke Style            |
| ----------------------------------- | ----------------- | ----------------------- |
| **Operators** (spread, stack, etc.) | Amber (`#f59e0b`) | Dashed `6,3` with label |
| **Shapes** (rect, circle, etc.)     | Green (`#10b981`) | Dashed `4,2`            |
| **Transforms** (polar, clock, etc.) | Blue (`#3b82f6`)  | Dashed `4,2`            |
| **Refs**                            | Gray (`#6b7280`)  | Dashed `4,2`            |

Operator nodes include text labels above their bounding box showing the type, name (if any), and dimensions.

### Example: Standalone SVG

```ts
import { Chart, spread, rect, renderBoundingBoxOverlay } from "gofish-graphics";

const debugData = await Chart(data)
  .flow(spread("category", { dir: "x" }))
  .mark(rect({ h: "value" }))
  .debug({ w: 400, h: 300 });

const { w, h } = debugData.snapshot.renderOptions;

// Create an SVG element with the overlay
const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttribute("width", String(w));
svg.setAttribute("height", String(h));
svg.style.background = "#1e293b";
svg.innerHTML = renderBoundingBoxOverlay(debugData.snapshot);

document.body.appendChild(svg);
```

### Example: Layer Over Existing Chart

```ts
// Render the chart normally
Chart(data)
  .flow(spread("category", { dir: "x" }))
  .mark(rect({ h: "value" }))
  .render(container, { w: 400, h: 300 });

// Capture debug data for the same chart
const debugData = await Chart(data)
  .flow(spread("category", { dir: "x" }))
  .mark(rect({ h: "value" }))
  .debug({ w: 400, h: 300 });

// Find the rendered SVG and append the overlay
const svg = container.querySelector("svg");
svg.innerHTML += renderBoundingBoxOverlay(debugData.snapshot);
```

### Interactivity with Inspector

The overlay SVG elements include `data-debug-uid` attributes that match the UIDs in the AST tree. You can use this to sync highlighting between the overlay and the inspector:

```ts
const inspector = inspect(debugData);
const svg = /* your chart SVG */;
svg.innerHTML += renderBoundingBoxOverlay(debugData.snapshot);

// When a node is selected in the inspector, highlight it in the overlay
inspector.addEventListener("gofish-debug-select", (e) => {
  const { uid } = e.detail;

  // Dim all overlay rects
  svg.querySelectorAll("[data-debug-uid]").forEach(el => {
    el.setAttribute("opacity", "0.15");
  });

  // Highlight the selected one
  const selected = svg.querySelector(`[data-debug-uid="${uid}"]`);
  if (selected) {
    selected.setAttribute("opacity", "1");
    selected.setAttribute("stroke-width", "3");
  }
});
```

### Output Structure

The returned SVG string has this structure:

```xml
<g class="gofish-debug-overlay" data-debug-overlay="bounds">
  <!-- Operator node -->
  <rect x="0" y="0" width="400" height="300"
        fill="none" stroke="#f59e0b" stroke-width="2"
        stroke-dasharray="6,3" opacity="0.7"
        data-debug-uid="node-0" data-debug-type="spread" data-debug-category="operator">
    <title>spread — 400.0x300.0</title>
  </rect>
  <text x="2" y="-3" fill="#f59e0b" font-size="9" font-family="monospace">
    spread 400x300
  </text>

  <!-- Shape nodes (children) -->
  <rect x="0" y="50" width="60" height="250" ... data-debug-uid="node-1" />
  <rect x="70" y="30" width="60" height="270" ... data-debug-uid="node-2" />
  <!-- ... more children ... -->
</g>
```
