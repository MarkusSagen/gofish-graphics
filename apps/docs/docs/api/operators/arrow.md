# arrow

Draws a curved arrow from one element to another. Uses the perfect-arrows library for smooth box-to-box arrow paths.

::: starfish

```js
gf.Arrow({ stroke: "black", strokeWidth: 2, bow: 0.2 }, [
  gf.rect({ x: 20, y: 50, w: 40, h: 30, fill: gf.color.blue[3] }),
  gf.rect({ x: 160, y: 50, w: 40, h: 30, fill: gf.color.red[3] }),
]).render(root, { w: 250, h: 150 });
```

:::

## Signature

```ts
Arrow(opts, [from, to])
```

## Parameters

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `stroke` | `string` | `"black"` | Arrow line color |
| `strokeWidth` | `number` | `3` | Arrow line width |
| `bow` | `number` | `0.2` | Arc curvature (0 = straight, higher = more curved) |
| `stretch` | `number` | `0.5` | Stretch factor for arrow length |
| `stretchMin` | `number` | `40` | Minimum stretch in pixels |
| `stretchMax` | `number` | `420` | Maximum stretch in pixels |
| `padStart` | `number` | `5` | Gap from start element |
| `padEnd` | `number` | `20` | Gap from end element |
| `flip` | `boolean` | `false` | Flip arrow curvature direction |
| `straights` | `boolean` | `true` | Allow straight arrows when appropriate |
| `start` | `boolean` | `false` | Show circle marker at start point |

Expects exactly 2 children: the source and target elements.

## Examples

```ts
// Straight arrow between two boxes
Arrow({ bow: 0, strokeWidth: 2 }, [source, target])

// Curved arrow with start marker
Arrow({ bow: 0.5, start: true, padEnd: 30 }, [nodeA, nodeB])
```

## See Also

- [connect](/api/operators/connect) — Ribbon-style connections between elements
