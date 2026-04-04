# wrap

Draws a smooth bubble-set outline around all child elements. Uses the BubbleSets algorithm to compute a contour path that tightly wraps around the children.

::: starfish

```js
gf.Wrap([
  gf.rect({ x: 10, y: 10, w: 30, h: 30, fill: gf.color.blue[3] }),
  gf.rect({ x: 60, y: 20, w: 20, h: 40, fill: gf.color.red[3] }),
]).render(root, { w: 200, h: 150 });
```

:::

## Signature

```ts
Wrap(children)
```

## Parameters

| Option | Type | Description |
|--------|------|-------------|
| `children` | `GoFishAST[]` | Array of child nodes to wrap |

The wrap outline is rendered as a black stroke path with no fill. The path is computed using sampling, simplification, and B-spline smoothing for a natural appearance.

## Examples

```ts
// Wrap a group of scattered elements
Wrap([
  ellipse({ cx: 20, cy: 20, w: 10, h: 10 }),
  ellipse({ cx: 60, cy: 40, w: 10, h: 10 }),
  ellipse({ cx: 40, cy: 60, w: 10, h: 10 }),
])
```

## See Also

- [enclose](/api/operators/enclose) — Simpler rounded rectangle enclosure
- [layer](/api/operators/layer) — Overlay without visual wrapper
