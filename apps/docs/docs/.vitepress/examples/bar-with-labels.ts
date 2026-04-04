gf.Layer([
  gf.Chart(seafood)
    .flow(gf.spread("lake", { dir: "x" }))
    .mark(gf.rect({ h: "count" }).name("bars")),
  gf.Chart(gf.select("bars"))
    .flow(gf.group("lake"))
    .mark(((d) => {
      return gf.Spread(
        { direction: "y", alignment: "middle", spacing: 10 },
        [gf.ref(d[0]), gf.text({ text: String(_.sumBy(d, "count")) })]
      );
    })),
]).render(root, {
  w: 500,
  h: 300,
  axes: true,
});
