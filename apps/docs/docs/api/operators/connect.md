# connect

Draws connective paths between pairs of child elements. Used to create ribbons, flow lines, and connections between positioned marks.

::: starfish

```js
gf.Layer([
  gf.Chart(seafood)
    .flow(
      gf.spread("lake", { dir: "x", spacing: 64 }),
      gf.derive((d) => _.sortBy(d, "count")),
      gf.stack("species", { dir: "y" })
    )
    .mark(gf.rect({ w: 16, h: "count", fill: "species" }).name("bars")),
  gf.Chart(gf.select("bars"))
    .flow(gf.group("species"))
    .mark(gf.area({ opacity: 0.5 })),
]).render(root, { w: 400, h: 250, axes: true });
```

:::

## Variants

| Function | Direction | Mode |
|----------|-----------|------|
| `Connect(opts, children)` | Specified via `direction` | Low-level operator |
| `ConnectX(opts, children)` | Horizontal (x) | Shorthand |
| `ConnectY(opts, children)` | Vertical (y) | Shorthand |

In the v3 API, connections are typically created via the `line()` and `area()` marks with the `select()` pattern rather than using `Connect` directly.

## Signature

```ts
Connect({ direction, fill, interpolation, stroke, strokeWidth, opacity, mode, mixBlendMode }, children)
ConnectX(opts, children)
ConnectY(opts, children)
```

## Parameters

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `direction` | `"x" \| "y"` | — | Connection direction |
| `fill` | `string` | First child's color | Fill color for the connection path |
| `interpolation` | `"linear" \| "bezier"` | `"linear"` | Path interpolation method |
| `stroke` | `string` | Same as fill | Stroke color |
| `strokeWidth` | `number` | `0` | Stroke width |
| `opacity` | `number` | `1` | Path opacity |
| `mode` | `"edge-to-edge" \| "center-to-center"` | `"edge-to-edge"` | How to connect elements |
| `mixBlendMode` | `"multiply" \| "normal"` | `"multiply"` (edge-to-edge) / `"normal"` (center-to-center) | SVG blend mode |

## Modes

**edge-to-edge** (default): Connects the full edges of adjacent elements, creating filled ribbon shapes. Used for area charts, ribbon charts, and Sankey-like flows.

**center-to-center**: Connects the center points of elements with a line. Used for line charts, bump charts, and stringline diagrams.

## Examples

```ts
// Ribbon connection between named bars (v1/v2 API)
ConnectX(
  { fill: "steelblue", interpolation: "bezier", opacity: 0.7 },
  [ref("source"), ref("target")]
)

// Line connecting points (v1/v2 API)
ConnectY(
  { strokeWidth: 2, mode: "center-to-center" },
  For(data, (d) => ref(`point-${d.id}`))
)

// v3 equivalent using line/area marks
Layer([
  Chart(data).flow(scatter({ x: "xField" }))
    .mark(scaffold({ h: "value" }).name("points")),
  Chart(select("points")).mark(area({ opacity: 0.8 })),
])
```

## See Also

- [line](/api/marks/line) — v3 mark for center-to-center connections
- [area](/api/marks/area) — v3 mark for edge-to-edge connections
- [select](/api/selection/select) — Referencing named layers
