# position

Positions a single child element at explicit (x, y) coordinates. Positioning is relative to the child's center point.

::: starfish

```js
gf.Layer([
  gf.Position({ x: 50, y: 30 },
    gf.rect({ w: 40, h: 40, fill: gf.color.blue[3] })
  ),
  gf.Position({ x: 150, y: 80 },
    gf.ellipse({ w: 30, h: 30, fill: gf.color.red[3] })
  ),
]).render(root, { w: 200, h: 150 });
```

:::

## Signature

```ts
Position({ x, y, key }, child)
```

## Parameters

| Option | Type | Description |
|--------|------|-------------|
| `x` | `number \| Value` | X coordinate (literal or data-bound) |
| `y` | `number \| Value` | Y coordinate (literal or data-bound) |
| `key` | `string` | Optional identifier |

Expects exactly one child element.

## Examples

```ts
// Place a label at a fixed position
Position({ x: 100, y: 50 },
  text({ text: "Hello", fontSize: 14 })
)

// Data-bound positioning
Position({ x: v(datum.xPos), y: v(datum.yPos) },
  circle({ r: 5, fill: "steelblue" })
)
```

## See Also

- [scatter](/api/operators/scatter) — Data-driven positioning for groups
- [spread](/api/operators/spread) — Automatic layout along an axis
