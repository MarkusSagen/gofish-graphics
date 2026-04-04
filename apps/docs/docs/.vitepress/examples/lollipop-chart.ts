const data = [
  { category: "Alpha", value: 85 },
  { category: "Beta", value: 62 },
  { category: "Gamma", value: 94 },
  { category: "Delta", value: 47 },
  { category: "Epsilon", value: 73 },
  { category: "Zeta", value: 58 },
];

gf.Layer([
  gf.Chart(data)
    .flow(gf.spread("category", { dir: "x" }))
    .mark(gf.rect({ h: "value", fill: "#e2e8f0", strokeWidth: 0 }).name("bars")),
  gf.Chart(data)
    .flow(gf.spread("category", { dir: "x" }))
    .mark(gf.circle({ r: 8, fill: "#3b82f6" })),
]).render(root, {
  w: 500,
  h: 300,
  axes: true,
});
