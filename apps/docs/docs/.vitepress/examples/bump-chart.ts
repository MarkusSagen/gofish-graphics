gf.Layer([
  gf
    .Chart(newCarColors)
    .flow(
      gf.spread("Year", { dir: "x" }),
      gf.derive((d) => _.sortBy(d, "Rank")),
      gf.spread({ dir: "y", spacing: 16, alignment: "start" })
    )
    .mark(gf.ellipse({ w: 8, h: 8, fill: "Color" }).name("points")),
  gf
    .Chart(gf.select("points"))
    .flow(gf.group("Color"))
    .mark(gf.line({ strokeWidth: 2 })),
]).render(root, { w: 500, h: 300 });
