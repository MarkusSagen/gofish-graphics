# Debug Inspector

GoFish's debug inspector lets you introspect the rendering pipeline — see the AST tree, node dimensions, bounding boxes, coordinate spaces, and per-pass event logs.

For a guided walkthrough, see the [Debugging Guide](/guides/debugging).

## Quick Example

```ts
import { Chart, spread, rect, inspect } from "gofish-graphics";

const debugData = await Chart(data)
  .flow(spread("category", { dir: "x" }))
  .mark(rect({ h: "value" }))
  .debug({ w: 400, h: 300 });

// Interactive inspector widget
document.body.appendChild(inspect(debugData));
```

## API Surface

### Core

| Function                              | Description                                               |
| ------------------------------------- | --------------------------------------------------------- |
| [`.debug()`](/api/debug/debug-method) | Runs the rendering pipeline and captures a debug snapshot |
| [`inspect()`](/api/debug/inspect)     | Creates an interactive HTML inspector from debug data     |

### Utilities

| Function                                                    | Description                                |
| ----------------------------------------------------------- | ------------------------------------------ |
| [`saveDebugData()`](/api/debug/save-load#savedebugdata)     | Downloads debug data as a JSON file        |
| [`loadDebugData()`](/api/debug/save-load#loaddebugdata)     | Parses a JSON string into typed debug data |
| [`debugDataToJson()`](/api/debug/save-load#debugdatatojson) | Serializes debug data to a JSON string     |

### Visualization

| Function                                            | Description                                  |
| --------------------------------------------------- | -------------------------------------------- |
| [`renderBoundingBoxOverlay()`](/api/debug/overlays) | Generates SVG overlay showing bounding boxes |

## Types

All debug types are exported from the main library:

```ts
import type {
  DebugData, // Top-level container: { snapshot, events }
  DebugSnapshot, // AST tree + scales + render options
  DebugNode, // Single node in the AST tree
  DebugEventLog, // Ordered list of rendering pass events
  DebugEvent, // Single event from a rendering pass
} from "gofish-graphics";
```

### `DebugData`

The top-level container returned by `.debug()`.

```ts
interface DebugData {
  snapshot: DebugSnapshot;
  events: DebugEventLog;
}
```

### `DebugSnapshot`

A point-in-time capture of the AST after all rendering passes.

```ts
interface DebugSnapshot {
  version: 1;
  timestamp: number;
  renderOptions: { w: number; h: number; padding?: number };
  tree: DebugNode;
  scales: {
    color: Record<string, string>; // field value → hex color
    position: { x?: DebugScale; y?: DebugScale };
    ordinal: { x?: string[]; y?: string[] };
  };
}
```

### `DebugNode`

A single node in the AST tree. Every node has dimensions, transform, bounds, and space info.

```ts
interface DebugNode {
  uid: string;
  type: string; // e.g. "spread", "rect", "polar"
  name?: string; // from .name("bars")
  key?: string; // axis label key
  category: "shape" | "operator" | "transform" | "ref";
  intrinsicDims: { x: DimInfo; y: DimInfo };
  transform: { translate: [number, number]; scale?: [number, number] };
  globalBounds: { x: number; y: number; w: number; h: number };
  underlyingSpace: { x: SpaceInfo; y: SpaceInfo };
  dataBinding?: {
    field: string;
    rawValue: number | string;
    mappedValue: number;
    scaleDescription: string;
  };
  color?: { raw: string; resolved: string };
  children: DebugNode[];
}
```

### `DimInfo`

Dimension information for one axis of a node.

```ts
interface DimInfo {
  min: number;
  center: number;
  max: number;
  size: number;
  embedded: boolean; // true if the dimension is determined by the node itself
  shared: boolean; // true if shared with siblings (e.g. via spread)
}
```

### `SpaceInfo`

Coordinate space information for one axis.

```ts
interface SpaceInfo {
  kind: "position" | "ordinal" | "size" | "difference" | "undefined";
  domain?: [number, number] | string[];
  coordinateTransform?: string; // e.g. "polar", "clock"
}
```

### `DebugEvent`

A single event captured during a rendering pass.

```ts
interface DebugEvent {
  pass:
    | "colorScale"
    | "names"
    | "keys"
    | "sizeDomains"
    | "underlyingSpace"
    | "posScales"
    | "layout"
    | "placement"
    | "render";
  nodeUid: string;
  nodeType: string;
  timestamp: number; // monotonic sequence number
  message: string;
  data?: Record<string, unknown>;
}
```

### `DebugScale`

Scale information for position axes.

```ts
interface DebugScale {
  domain: [number, number];
  range: [number, number];
  ticks: number[];
}
```
