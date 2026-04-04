gf.Chart(seafood)
  .flow(
    gf.spread("lake", { dir: "x" }),
    gf.stack("species", { dir: "y" })
  )
  .mark(gf.rect({ h: "count", fill: "species", label: true }))
  .render(root, {
    w: 500,
    h: 300,
    axes: true,
  });
