import type { Meta, StoryObj } from "@storybook/html";
import { initializeContainer } from "./helper";
import { seafood } from "../src/data/catch";
import { penguins } from "../src/data/penguins";
import { nightingale } from "../src/data/nightingale";
import {
  chart,
  spread,
  stack,
  scatter,
  group,
  derive,
  rect,
  circle,
  line,
  area,
  select,
} from "../src/ast/marks/chart";
import { Layer } from "../src/lib";
import { inspect } from "../src/debug/inspector/index";
import { renderBoundingBoxOverlay } from "../src/debug/overlays";
import { orderBy } from "lodash";

// ─── Helper ────────────────────────────────────────────────────────────
function debugStory(
  buildChart: () => ReturnType<ReturnType<typeof chart>["debug"]>,
  opts?: { showOverlay?: boolean; defaultTab?: "tree" | "snapshot" },
) {
  const container = initializeContainer();
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.gap = "24px";

  buildChart().then((debugData) => {
    // If overlay requested, show the chart SVG with bounding box overlay
    if (opts?.showOverlay) {
      const overlaySection = document.createElement("div");
      overlaySection.innerHTML = `
        <h3 style="font-family:monospace;color:#94a3b8;margin:0 0 8px">SVG Bounding Box Overlay</h3>
        <svg width="${debugData.snapshot.renderOptions.w}" height="${debugData.snapshot.renderOptions.h}"
             style="background:#1e293b;border-radius:8px;border:1px solid #334155">
          ${renderBoundingBoxOverlay(debugData.snapshot)}
        </svg>
      `;
      container.appendChild(overlaySection);
    }

    // Inspector widget
    const inspectorSection = document.createElement("div");
    const inspectorEl = inspect(debugData, {
      defaultTab: opts?.defaultTab ?? "tree",
      height: "500px",
    });
    inspectorSection.appendChild(inspectorEl);
    container.appendChild(inspectorSection);
  });

  return container;
}

// ─── Meta ──────────────────────────────────────────────────────────────
const meta: Meta = {
  title: "Debug/Inspector",
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;

// ─── Stories ───────────────────────────────────────────────────────────

/**
 * Basic bar chart — simplest debug example.
 * Shows the AST tree for a spread + rect composition.
 */
export const BarChart: StoryObj = {
  render: () =>
    debugStory(() =>
      chart(seafood)
        .flow(spread("lake", { dir: "x" }))
        .mark(rect({ h: "count" }))
        .debug({ w: 500, h: 300 }),
    ),
};

/**
 * Stacked bar chart — two operators (spread + stack).
 * The tree view shows how spread creates groups and stack nests within them.
 */
export const StackedBarChart: StoryObj = {
  render: () =>
    debugStory(() =>
      chart(seafood)
        .flow(
          spread("lake", { dir: "x" }),
          stack("species", { dir: "y", label: false }),
        )
        .mark(rect({ h: "count", fill: "species" }))
        .debug({ w: 500, h: 300 }),
    ),
};

/**
 * Scatter plot using the penguins dataset.
 * Shows how scatter() assigns positions to individual data points.
 */
export const ScatterPlot: StoryObj = {
  render: () => {
    const data = penguins.filter(
      (d: Record<string, unknown>) => d.body_mass_g != null && d.flipper_length_mm != null,
    );
    return debugStory(() =>
      chart(data)
        .flow(scatter({ x: "body_mass_g", y: "flipper_length_mm" }))
        .mark(circle({ r: 3, fill: "species" }))
        .debug({ w: 500, h: 400 }),
    );
  },
};

/**
 * Grouped bar chart — spread nested within spread.
 * Demonstrates deeper AST nesting in the tree view.
 */
export const GroupedBarChart: StoryObj = {
  render: () =>
    debugStory(() =>
      chart(seafood)
        .flow(
          spread("lake", { dir: "x" }),
          spread("species", { dir: "x" }),
        )
        .mark(rect({ h: "count", fill: "species" }))
        .debug({ w: 600, h: 300 }),
    ),
};

/**
 * Nightingale rose chart data with stack operator.
 * Shows the debug view for a different dataset structure.
 */
export const NightingaleChart: StoryObj = {
  render: () =>
    debugStory(() =>
      chart(nightingale)
        .flow(
          spread("Month", { dir: "x" }),
          stack("Type", { dir: "y", label: false }),
        )
        .mark(rect({ h: "Death", fill: "Type" }))
        .debug({ w: 600, h: 300 }),
    ),
};

/**
 * Ribbon chart with layering and selection.
 * Demonstrates named marks and cross-chart selection in the debug tree.
 */
export const RibbonChart: StoryObj = {
  render: () => {
    const container = initializeContainer();
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "24px";

    // For ribbon charts, we debug just the bar layer
    chart(seafood)
      .flow(
        spread("lake", { dir: "x", spacing: 64 }),
        derive((d) => orderBy(d, "count", "desc")),
        stack("species", { dir: "y", label: false }),
      )
      .mark(rect({ h: "count", fill: "species" }).name("bars"))
      .debug({ w: 500, h: 300 })
      .then((debugData) => {
        const el = inspect(debugData, { height: "500px" });
        container.appendChild(el);
      });

    return container;
  },
};

// ─── SVG Overlay Stories ───────────────────────────────────────────────

/**
 * Bar chart with SVG bounding box overlay visible above the inspector.
 * Shows color-coded boxes: amber=operator, green=shape, blue=transform.
 */
export const WithBoundingBoxOverlay: StoryObj = {
  render: () =>
    debugStory(
      () =>
        chart(seafood)
          .flow(spread("lake", { dir: "x" }))
          .mark(rect({ h: "count" }))
          .debug({ w: 500, h: 300 }),
      { showOverlay: true },
    ),
};

/**
 * Stacked bar chart with overlay — shows nested bounding boxes.
 */
export const StackedWithOverlay: StoryObj = {
  render: () =>
    debugStory(
      () =>
        chart(seafood)
          .flow(
            spread("lake", { dir: "x" }),
            stack("species", { dir: "y", label: false }),
          )
          .mark(rect({ h: "count", fill: "species" }))
          .debug({ w: 500, h: 300 }),
      { showOverlay: true },
    ),
};

// ─── Tab Default Stories ───────────────────────────────────────────────

/**
 * Opens directly on the Snapshot tab — shows raw JSON data.
 * Useful for seeing the complete debug data structure.
 */
export const SnapshotTabDefault: StoryObj = {
  render: () =>
    debugStory(
      () =>
        chart(seafood)
          .flow(spread("lake", { dir: "x" }))
          .mark(rect({ h: "count" }))
          .debug({ w: 500, h: 300 }),
      { defaultTab: "snapshot" },
    ),
};

/**
 * Larger chart with more data — tests inspector with bigger AST trees.
 */
export const LargeDataset: StoryObj = {
  render: () => {
    const data = penguins.filter(
      (d: Record<string, unknown>) => d.species != null && d.island != null,
    );
    return debugStory(() =>
      chart(data)
        .flow(
          spread("island", { dir: "x" }),
          spread("species", { dir: "x" }),
        )
        .mark(rect({ h: 20, fill: "species" }))
        .debug({ w: 700, h: 400 }),
    );
  },
};
