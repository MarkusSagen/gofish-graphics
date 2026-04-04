# arcLengthPolar

Converts arc-length polar coordinates to Cartesian. Instead of using an angle for the angular component, this transform uses arc length along circles of a given radius. This makes angular spacing proportional to actual distance traveled.

## Signature

```ts
arcLengthPolar()
```

## Parameters

None.

## Coordinate Mapping

| Cartesian | Arc-Length Polar |
|-----------|-----------------|
| x | s — arc length along circles of radius r (range: 0 to 2pi) |
| y | r — radius from center (range: 0 to 100) |

## Examples

```ts
// Arc-length polar coordinates
Frame({ coord: arcLengthPolar() }, children)
```

## See Also

- [polar](/api/coords/polar) — Standard angle-based polar coordinates
- [clock](/api/coords/clock) — Clock-face polar coordinates
