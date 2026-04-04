# Labeled Scatter Plot

A scatter plot where each point has a text label positioned next to it. Uses `Layer` with `select` to compose circles with text marks.

<!-- ::: starfish example:labeled-scatter-plot -->

**Live Editor**

::: starfish-live {template=vanilla-ts rtl lightTheme=aquaBlue darkTheme=atomDark previewHeight=400 coderHeight=512}

```ts index.ts
import {
  Chart,
  Layer,
  scatter,
  select,
  circle,
  text,
  ref,
  Spread,
} from "gofish-graphics";

const container = document.getElementById("app");

const catchLocationsArray = [
  { lake: "Lake A", x: 5.26, y: 22.64 },
  { lake: "Lake B", x: 30.87, y: 120.75 },
  { lake: "Lake C", x: 50.01, y: 60.94 },
  { lake: "Lake D", x: 115.13, y: 94.16 },
  { lake: "Lake E", x: 133.05, y: 50.44 },
  { lake: "Lake F", x: 85.99, y: 172.78 },
];

Layer([
  Chart(catchLocationsArray)
    .flow(scatter("lake", { x: "x", y: "y" }))
    .mark(circle({ r: 5 }).name("dots")),
  Chart(select("dots"))
    .mark((d) => {
      return Spread(
        { direction: "x", alignment: "middle", spacing: 4 },
        [ref(d), text({ text: d.lake, fontSize: 10 })]
      );
    }),
]).render(container, {
  w: 500,
  h: 300,
  axes: true,
});
```

:::
