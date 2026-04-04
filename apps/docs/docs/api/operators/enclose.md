# enclose

Draws a rounded rectangle enclosure around all child elements with configurable padding and corner radii.

::: starfish

```js
gf.Enclose({ padding: 8, rx: 6, ry: 6 }, [
  gf.StackX({ spacing: 4 }, [
    gf.rect({ w: 20, h: 30, fill: gf.color.blue[3] }),
    gf.rect({ w: 20, h: 20, fill: gf.color.red[3] }),
    gf.rect({ w: 20, h: 40, fill: gf.color.green[3] }),
  ]),
]).render(root, { w: 200, h: 150 });
```

:::

## Signature

```ts
Enclose({ padding, rx, ry }, children)
```

## Parameters

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `padding` | `number` | `2` | Padding around children in pixels |
| `rx` | `number` | `2` | Horizontal corner radius |
| `ry` | `number` | `2` | Vertical corner radius |

## Examples

```ts
// Group with visible boundary
Enclose({ padding: 4 }, [
  StackY({ spacing: 2 }, items.map(d =>
    rect({ w: 10, h: 10, fill: d.color })
  ))
])

// Tight enclosure with sharp corners
Enclose({ padding: 0, rx: 0, ry: 0 }, children)
```

## See Also

- [wrap](/api/operators/wrap) — Organic bubble-set outline
- [layer](/api/operators/layer) — Overlay without visual boundary
