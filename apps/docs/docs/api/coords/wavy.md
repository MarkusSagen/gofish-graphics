# wavy

Applies sinusoidal wave distortions to Cartesian coordinates, creating a wavy, hand-drawn appearance. Adds sine-based offsets proportional to the opposite coordinate.

::: starfish

```js
gf.Frame({ coord: gf.wavy() }, [
  gf.StackX({ spacing: 8 }, [
    gf.rect({ w: 30, h: 60, fill: gf.color.blue[3] }),
    gf.rect({ w: 30, h: 80, fill: gf.color.red[3] }),
    gf.rect({ w: 30, h: 40, fill: gf.color.green[3] }),
  ]),
]).render(root, { w: 200, h: 150 });
```

:::

## Signature

```ts
wavy()
```

## Parameters

None.

## Coordinate Mapping

| Cartesian | Wavy |
|-----------|------|
| x | x + sin-based offset from y (range: 0 to 100) |
| y | y + sin-based offset from x (range: 0 to 100) |

Straight lines become undulating curves, giving charts an organic, sketchy aesthetic.

## Examples

```ts
// Wavy bar chart
Frame({ coord: wavy() }, [
  StackX({ spacing: 4 },
    data.map(d => rect({ w: 20, h: d.value, fill: d.color }))
  )
])
```

## See Also

- [polar](/api/coords/polar) — Polar coordinates
- [bipolar](/api/coords/bipolar) — Two-focus coordinate system
