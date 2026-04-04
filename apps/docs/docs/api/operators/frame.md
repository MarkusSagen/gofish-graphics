# frame

A wrapper operator that scopes children within a coordinate system or layer. If a `coord` option is provided, applies that coordinate transformation; otherwise delegates to a layer.

## Signature

```ts
Frame(options, children)
Frame(children)
```

## Parameters

| Option | Type | Description |
|--------|------|-------------|
| `coord` | `CoordinateTransform` | Coordinate system (polar, clock, bipolar, etc.) |
| `key` | `string` | Identifier for the frame |
| `x` | `number` | X offset |
| `y` | `number` | Y offset |
| `w` | `number` | Width override |
| `h` | `number` | Height override |
| `transform.scale.x` | `number` | Scale factor for x axis |
| `transform.scale.y` | `number` | Scale factor for y axis |

## Examples

```ts
// Frame with polar coordinates
Frame({ coord: polar() }, [
  StackX({ spacing: 0 },
    data.map(d => rect({ w: d.value, h: 20, fill: d.color }))
  )
])

// Frame with offset positioning
Frame({ x: 100, y: 50 }, [
  rect({ w: 40, h: 30, fill: "steelblue" })
])

// Frame as simple grouping (no options)
Frame([child1, child2, child3])
```

## See Also

- [layer](/api/operators/layer) — Overlay children without frame scoping
- [polar](/api/coords/polar) — Polar coordinate transform
- [clock](/api/coords/clock) — Clock-face coordinate transform
