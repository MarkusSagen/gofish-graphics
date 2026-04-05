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
  derive,
  rect,
  circle,
} from "../src/ast/marks/chart";
import { inspect } from "../src/debug/inspector/index";
import { renderBoundingBoxOverlay } from "../src/debug/overlays";
import { orderBy } from "lodash";

// ─── Color constants (must match overlays.ts) ────────────────────────
const COLORS: Record<string, string> = {
  operator: "#f59e0b",
  shape: "#10b981",
  transform: "#3b82f6",
  ref: "#6b7280",
};

// ─── Linked Debug Panel ──────────────────────────────────────────────
// Renders the actual chart + an interactive overlay + the inspector,
// all wired together so clicking in one highlights the other.

function linkedDebugStory(
  buildChart: () => ReturnType<ReturnType<typeof chart>["debug"]>,
  renderChart: (container: HTMLElement, opts: { w: number; h: number }) => void,
  opts: {
    w: number;
    h: number;
    defaultTab?: "tree" | "snapshot";
  },
) {
  const root = initializeContainer();
  root.style.display = "flex";
  root.style.flexDirection = "row";
  root.style.gap = "0";
  root.style.alignItems = "flex-start";
  root.style.fontFamily = "monospace";
  root.style.minHeight = "600px";

  // ── Left: chart + overlay ──
  const chartPanel = document.createElement("div");
  chartPanel.style.cssText = `
    flex: 0 0 ${opts.w + 40}px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  `;

  // Chart container (actual rendered visualization)
  const chartContainer = document.createElement("div");
  chartContainer.style.position = "relative";
  chartPanel.appendChild(chartContainer);

  // Legend
  const legend = document.createElement("div");
  legend.style.cssText = "display:flex;gap:16px;flex-wrap:wrap;padding:4px 0";
  legend.innerHTML = `
    <span style="font-size:11px;color:#94a3b8">
      <span style="color:${COLORS.operator}">━━</span> operator
      <span style="color:${COLORS.shape};margin-left:8px">╌╌</span> shape
      <span style="color:${COLORS.transform};margin-left:8px">╌╌</span> transform
    </span>
  `;
  chartPanel.appendChild(legend);

  root.appendChild(chartPanel);

  // ── Right: inspector ──
  const inspectorPanel = document.createElement("div");
  inspectorPanel.style.cssText = `
    flex: 1;
    min-width: 400px;
    border-left: 1px solid #334155;
  `;
  root.appendChild(inspectorPanel);

  // Render the actual chart
  renderChart(chartContainer, { w: opts.w, h: opts.h });

  // Get debug data and wire everything together
  buildChart().then((debugData) => {
    // Create SVG overlay on top of the chart
    const overlaySvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );
    overlaySvg.setAttribute("width", String(opts.w));
    overlaySvg.setAttribute("height", String(opts.h));
    overlaySvg.style.cssText = `
      position: absolute; top: 0; left: 0;
      pointer-events: none;
    `;
    overlaySvg.innerHTML = renderBoundingBoxOverlay(debugData.snapshot);

    // Make overlay rects interactive
    overlaySvg.querySelectorAll("rect[data-debug-uid]").forEach((el) => {
      (el as SVGElement).style.pointerEvents = "all";
      (el as SVGElement).style.cursor = "pointer";
    });

    // Start with overlay hidden — show on first interaction
    overlaySvg
      .querySelectorAll("[data-debug-uid]")
      .forEach((el) => el.setAttribute("opacity", "0"));
    chartContainer.style.position = "relative";
    chartContainer.appendChild(overlaySvg);

    // Inspector widget
    const inspectorEl = inspect(debugData, {
      defaultTab: opts.defaultTab ?? "tree",
      height: "600px",
    });
    inspectorPanel.appendChild(inspectorEl);

    // ── Bidirectional linking ──

    // Helper: highlight a node in the overlay
    function highlightOverlayNode(uid: string | null) {
      overlaySvg.querySelectorAll("rect[data-debug-uid]").forEach((el) => {
        if (!uid) {
          // Reset: hide all
          el.setAttribute("opacity", "0");
          el.setAttribute("stroke-width", el.getAttribute("data-debug-category") === "operator" ? "2" : "1.5");
          return;
        }
        if (el.getAttribute("data-debug-uid") === uid) {
          el.setAttribute("opacity", "1");
          el.setAttribute("stroke-width", "3");
          // Also add a subtle fill highlight
          const cat = el.getAttribute("data-debug-category") || "shape";
          el.setAttribute("fill", COLORS[cat] || COLORS.shape);
          el.setAttribute("fill-opacity", "0.08");
        } else {
          // Show siblings at low opacity for context
          el.setAttribute("opacity", "0.25");
          el.setAttribute("fill", "none");
          el.setAttribute(
            "stroke-width",
            el.getAttribute("data-debug-category") === "operator"
              ? "2"
              : "1.5",
          );
        }
      });
      // Also show/hide text labels
      overlaySvg.querySelectorAll("text").forEach((el) => {
        el.setAttribute("opacity", uid ? "0.6" : "0");
      });
    }

    // Helper: select a node in the inspector tree
    function selectTreeNode(uid: string) {
      const header = inspectorEl.querySelector<HTMLElement>(
        `.gofish-tree-node-header[data-uid="${uid}"]`,
      );
      if (header) {
        header.click();
        header.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }

    // Inspector → Overlay: when tree node selected, highlight in chart
    inspectorEl.addEventListener("gofish-debug-select", ((
      e: CustomEvent,
    ) => {
      highlightOverlayNode(e.detail.uid);
    }) as EventListener);

    // Overlay → Inspector: when overlay rect clicked, select in tree
    overlaySvg.querySelectorAll("rect[data-debug-uid]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const uid = el.getAttribute("data-debug-uid");
        if (uid) {
          highlightOverlayNode(uid);
          selectTreeNode(uid);
        }
      });

      // Hover preview
      el.addEventListener("mouseenter", () => {
        const uid = el.getAttribute("data-debug-uid");
        if (uid) {
          el.setAttribute("opacity", "0.8");
          const cat = el.getAttribute("data-debug-category") || "shape";
          el.setAttribute("fill", COLORS[cat] || COLORS.shape);
          el.setAttribute("fill-opacity", "0.12");
        }
      });
      el.addEventListener("mouseleave", () => {
        // Restore to current selection state
        const selectedHeader = inspectorEl.querySelector(
          ".gofish-tree-node-header.selected",
        );
        const selectedUid = selectedHeader
          ? (selectedHeader as HTMLElement).dataset.uid
          : null;
        highlightOverlayNode(selectedUid || null);
      });
    });

    // Click on chart background to clear selection
    chartContainer.addEventListener("click", (e) => {
      if (e.target === chartContainer || e.target === overlaySvg) {
        highlightOverlayNode(null);
      }
    });
  });

  return root;
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
 * **Bar chart with linked inspector.**
 * Click a node in the tree → the corresponding bar highlights in the chart.
 * Click a bar in the overlay → it selects in the tree.
 */
export const BarChart: StoryObj = {
  render: () =>
    linkedDebugStory(
      () =>
        chart(seafood)
          .flow(spread("lake", { dir: "x" }))
          .mark(rect({ h: "count" }))
          .debug({ w: 500, h: 300 }),
      (container, opts) => {
        chart(seafood)
          .flow(spread("lake", { dir: "x" }))
          .mark(rect({ h: "count" }))
          .render(container, { ...opts, axes: true });
      },
      { w: 500, h: 300 },
    ),
};

/**
 * **Stacked bar chart** — shows nested operators in the tree.
 * Select a species-specific rect to see its data binding and color.
 */
export const StackedBarChart: StoryObj = {
  render: () =>
    linkedDebugStory(
      () =>
        chart(seafood)
          .flow(
            spread("lake", { dir: "x" }),
            stack("species", { dir: "y", label: false }),
          )
          .mark(rect({ h: "count", fill: "species" }))
          .debug({ w: 500, h: 300 }),
      (container, opts) => {
        chart(seafood)
          .flow(
            spread("lake", { dir: "x" }),
            stack("species", { dir: "y", label: false }),
          )
          .mark(rect({ h: "count", fill: "species" }))
          .render(container, { ...opts, axes: true });
      },
      { w: 500, h: 300 },
    ),
};

/**
 * **Scatter plot** — penguins dataset.
 * Each circle is a separate node in the AST tree.
 */
export const ScatterPlot: StoryObj = {
  render: () => {
    const data = penguins.filter(
      (d: Record<string, unknown>) =>
        d.body_mass_g != null && d.flipper_length_mm != null,
    );
    return linkedDebugStory(
      () =>
        chart(data)
          .flow(scatter({ x: "body_mass_g", y: "flipper_length_mm" }))
          .mark(circle({ r: 3, fill: "species" }))
          .debug({ w: 500, h: 400 }),
      (container, opts) => {
        chart(data)
          .flow(scatter({ x: "body_mass_g", y: "flipper_length_mm" }))
          .mark(circle({ r: 3, fill: "species" }))
          .render(container, { ...opts, axes: true });
      },
      { w: 500, h: 400 },
    );
  },
};

/**
 * **Grouped bar chart** — nested spread operators.
 * Demonstrates deeper AST nesting: spread(lake) > spread(species) > rect.
 */
export const GroupedBarChart: StoryObj = {
  render: () =>
    linkedDebugStory(
      () =>
        chart(seafood)
          .flow(spread("lake", { dir: "x" }), spread("species", { dir: "x" }))
          .mark(rect({ h: "count", fill: "species" }))
          .debug({ w: 600, h: 300 }),
      (container, opts) => {
        chart(seafood)
          .flow(spread("lake", { dir: "x" }), spread("species", { dir: "x" }))
          .mark(rect({ h: "count", fill: "species" }))
          .render(container, { ...opts, axes: true });
      },
      { w: 600, h: 300 },
    ),
};

/**
 * **Nightingale chart** — different dataset showing mortality data.
 * Spread by month, stack by cause of death.
 */
export const NightingaleChart: StoryObj = {
  render: () =>
    linkedDebugStory(
      () =>
        chart(nightingale)
          .flow(
            spread("Month", { dir: "x" }),
            stack("Type", { dir: "y", label: false }),
          )
          .mark(rect({ h: "Death", fill: "Type" }))
          .debug({ w: 600, h: 300 }),
      (container, opts) => {
        chart(nightingale)
          .flow(
            spread("Month", { dir: "x" }),
            stack("Type", { dir: "y", label: false }),
          )
          .mark(rect({ h: "Death", fill: "Type" }))
          .render(container, { ...opts, axes: true });
      },
      { w: 600, h: 300 },
    ),
};

/**
 * **Ribbon chart** — with derive (orderBy) and named marks.
 * Shows how derive transforms data ordering in the tree.
 */
export const RibbonChart: StoryObj = {
  render: () =>
    linkedDebugStory(
      () =>
        chart(seafood)
          .flow(
            spread("lake", { dir: "x", spacing: 64 }),
            derive((d) => orderBy(d, "count", "desc")),
            stack("species", { dir: "y", label: false }),
          )
          .mark(rect({ h: "count", fill: "species" }).name("bars"))
          .debug({ w: 500, h: 300 }),
      (container, opts) => {
        chart(seafood)
          .flow(
            spread("lake", { dir: "x", spacing: 64 }),
            derive((d) => orderBy(d, "count", "desc")),
            stack("species", { dir: "y", label: false }),
          )
          .mark(rect({ h: "count", fill: "species" }).name("bars"))
          .render(container, { ...opts, axes: true });
      },
      { w: 500, h: 300 },
    ),
};

/**
 * **Snapshot tab default** — opens on the raw JSON view.
 * Click Tree tab to switch to the interactive linked view.
 */
export const SnapshotTabDefault: StoryObj = {
  render: () =>
    linkedDebugStory(
      () =>
        chart(seafood)
          .flow(spread("lake", { dir: "x" }))
          .mark(rect({ h: "count" }))
          .debug({ w: 500, h: 300 }),
      (container, opts) => {
        chart(seafood)
          .flow(spread("lake", { dir: "x" }))
          .mark(rect({ h: "count" }))
          .render(container, { ...opts, axes: true });
      },
      { w: 500, h: 300, defaultTab: "snapshot" },
    ),
};
