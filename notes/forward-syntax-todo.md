# Forward Syntax Implementation Todo List

## Eventually TODO

- [ ] Fast next-layer for when you are just selecting the previous layer
- [ ] control over scatter pie radii
- [x] z-indexing (feat/z-index branch)
- [ ] position using center?

## Basic Charts

- [x] bar chart
- [x] horizontal bar chart
- [x] scatter plot
- [x] line chart
- [x] area chart
- [x] pie chart

## Still Basic

- [x] stacked bar chart
- [x] grouped bar chart
- [x] stacked area chart
- [x] donut chart
- [x] rose chart

## Slightly More Complex

- [x] streamgraph
- [x] mosaic
- [x] waffle
- [x] ribbon
- [x] polar ribbon
- [x] ridgeline
- [x] layered area
- [-] scatter pie (needs more control over variable radii)
- [x] connected scatter plot (uses z-index for layer ordering)
- [x] flower chart (v1/v2 only — needs absolute positioning for v3)
- [x] balloon (v1/v2 only — needs absolute positioning for v3)

## Even More Complicated

- [x] bump chart (ported to v3 in docs/bump-chart-v3 branch)
- [ ] box and whisker (v1/v2 only — needs nested Frame + ConnectY for v3)
- [ ] violin plot (v1/v2 only — needs KDE + nested ConnectY for v3)
- [ ] stringline (v1/v2 only — needs nested Frame + ConnectY for v3)
- [ ] icicle chart (v1/v2 only — needs tree/hierarchy operator for v3)
- [ ] sankey tree (v1/v2 only — needs tree/hierarchy operator for v3)
- [ ] nested waffle (v1/v2 only — needs nested composition for v3)
- [ ] nested mosaic (v1/v2 only — needs nested composition for v3)

## High-Level Chart API

- [x] barChart (JS + Python)
- [x] lineChart (JS + Python)
- [x] scatterChart (JS + Python)
- [x] areaChart (JS + Python, with .stack() support)
- [x] pieChart (JS + Python)
