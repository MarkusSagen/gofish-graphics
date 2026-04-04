# inspect

Creates an interactive HTML inspector widget from debug data. The widget displays a tabbed interface with a tree view of the AST and a raw JSON snapshot viewer.

## Signature

```ts
inspect(data: DebugData, options?: InspectOptions): HTMLElement
```

## Parameters

| Parameter            | Type                          | Default   | Description                 |
| -------------------- | ----------------------------- | --------- | --------------------------- |
| `data`               | `DebugData`                   | —         | Debug data from `.debug()`  |
| `options.theme`      | `"dark" \| "light" \| "auto"` | `"dark"`  | Color theme                 |
| `options.defaultTab` | `"tree" \| "snapshot"`        | `"tree"`  | Which tab to show first     |
| `options.width`      | `string`                      | `"100%"`  | CSS width of the inspector  |
| `options.height`     | `string`                      | `"600px"` | CSS height of the inspector |

Returns an `HTMLElement` containing the inspector widget.

## Examples

### Basic usage

```ts
import { Chart, spread, rect, inspect } from "gofish-graphics";

const debugData = await Chart(data)
  .flow(spread("category", { dir: "x" }))
  .mark(rect({ h: "value" }))
  .debug({ w: 400, h: 300 });

const inspector = inspect(debugData);
document.body.appendChild(inspector);
```

### Custom size and default tab

```ts
const inspector = inspect(debugData, {
  width: "800px",
  height: "500px",
  defaultTab: "snapshot",
});
```

### Listening for node selection events

The inspector dispatches a `gofish-debug-select` CustomEvent when a node is clicked in the tree:

```ts
const inspector = inspect(debugData);
document.body.appendChild(inspector);

inspector.addEventListener("gofish-debug-select", (e) => {
  const { uid } = e.detail;
  console.log("Selected node:", uid);

  // Highlight corresponding element in your chart SVG
  document.querySelectorAll(`[data-debug-uid]`).forEach((el) => {
    el.style.opacity = el.dataset.debugUid === uid ? "1" : "0.3";
  });
});
```

## `inspectHtml`

For environments that display raw HTML (Jupyter notebooks, Marimo, iframes), use `inspectHtml()` instead:

```ts
import { inspectHtml } from "gofish-graphics";

const html = inspectHtml(debugData, { height: "500px" });
// Returns a complete <!DOCTYPE html> document with inlined CSS and JS
```

The HTML version includes all interactivity (tab switching, tree expand/collapse, node selection, copy/download) as inline vanilla JavaScript — no external dependencies needed.

### Usage in an iframe

```ts
const iframe = document.createElement("iframe");
iframe.srcdoc = inspectHtml(debugData);
iframe.style.width = "100%";
iframe.style.height = "600px";
iframe.style.border = "none";
document.body.appendChild(iframe);
```

## Widget Features

Both `inspect()` and `inspectHtml()` provide:

- **Tab switching** between Tree and Snapshot views
- **Tree expand/collapse** with arrow toggles
- **Node selection** with detail panel showing dimensions, bounds, transforms, spaces
- **Breadcrumb navigation** showing path from root to selected node
- **Copy JSON** button to copy debug data to clipboard
- **Download JSON** button to save as a file
- **Color-coded categories** — operators (amber), shapes (green), transforms (blue), refs (gray)
