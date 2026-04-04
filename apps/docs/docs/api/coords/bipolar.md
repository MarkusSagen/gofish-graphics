# bipolar

A coordinate system with two focal points. Converts tau-sigma bipolar coordinates to Cartesian using hyperbolic and trigonometric functions. Useful for visualizations that emphasize regions near two poles.

## Signature

```ts
bipolar(fociDistance?)
```

## Parameters

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `fociDistance` | `number` | `100` | Distance between the two focal points |

## Coordinate Mapping

| Cartesian | Bipolar |
|-----------|---------|
| x | tau (range: -pi to pi) |
| y | sigma (range: -pi to pi) |

The two foci are placed symmetrically along the x-axis, separated by `fociDistance`.

## Examples

```ts
// Default bipolar coordinates
Frame({ coord: bipolar() }, children)

// Wider focal distance
Frame({ coord: bipolar(200) }, children)
```

## See Also

- [polar](/api/coords/polar) — Single-center polar coordinates
- [clock](/api/coords/clock) — Clock-face polar coordinates
