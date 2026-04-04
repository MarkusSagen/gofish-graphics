# Lollipop Chart

A lollipop chart combines thin bars with dots at the top of each bar. Uses `Layer` to overlay two chart layers — light bars with colored dots.

<!-- ::: starfish example:lollipop-chart -->

**Live Editor**

::: starfish-live {template=vanilla-ts rtl lightTheme=aquaBlue darkTheme=atomDark previewHeight=400 coderHeight=512}

```ts index.ts
import { Chart, Layer, spread, rect, circle } from "gofish-graphics";

const container = document.getElementById("app");

const data = [
  { category: "Alpha", value: 85 },
  { category: "Beta", value: 62 },
  { category: "Gamma", value: 94 },
  { category: "Delta", value: 47 },
  { category: "Epsilon", value: 73 },
  { category: "Zeta", value: 58 },
];

Layer([
  Chart(data)
    .flow(spread("category", { dir: "x" }))
    .mark(rect({ h: "value", fill: "#e2e8f0", strokeWidth: 0 })),
  Chart(data)
    .flow(spread("category", { dir: "x" }))
    .mark(circle({ r: 8, fill: "#3b82f6" })),
]).render(container, {
  w: 500,
  h: 300,
  axes: true,
});
```

:::
