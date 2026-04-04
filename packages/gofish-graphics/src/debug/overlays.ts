import type { DebugNode, DebugSnapshot } from "./types";

const COLORS = {
  operator: "#f59e0b", // amber
  shape: "#10b981", // green
  transform: "#3b82f6", // blue
  ref: "#6b7280", // gray
} as const;

function renderNodeOverlay(node: DebugNode, depth: number): string {
  const color = COLORS[node.category];
  const bounds = node.globalBounds;

  // Skip nodes with zero dimensions
  if (bounds.w === 0 && bounds.h === 0) return "";

  const opacity = Math.max(0.3, 0.7 - depth * 0.1);
  const strokeWidth = node.category === "operator" ? 2 : 1.5;

  // Bounding box rectangle
  const rect = `<rect
    x="${bounds.x}" y="${bounds.y}"
    width="${bounds.w}" height="${bounds.h}"
    fill="none" stroke="${color}" stroke-width="${strokeWidth}"
    stroke-dasharray="${node.category === "operator" ? "6,3" : "4,2"}"
    opacity="${opacity}"
    data-debug-uid="${node.uid}"
    data-debug-type="${node.type}"
    data-debug-category="${node.category}"
  >
    <title>${node.type}${node.name ? ` (${node.name})` : ""} — ${bounds.w.toFixed(1)}×${bounds.h.toFixed(1)}</title>
  </rect>`;

  // Label for operators (they're the structural containers)
  const label =
    node.category === "operator"
      ? `<text
          x="${bounds.x + 2}" y="${bounds.y - 3}"
          fill="${color}" font-size="9" font-family="monospace"
          opacity="${opacity}"
        >${node.type}${node.name ? ` (${node.name})` : ""} ${bounds.w.toFixed(0)}×${bounds.h.toFixed(0)}</text>`
      : "";

  // Recurse into children
  const children = node.children
    .map((child) => renderNodeOverlay(child, depth + 1))
    .join("\n");

  return `${rect}\n${label}\n${children}`;
}

export function renderBoundingBoxOverlay(snapshot: DebugSnapshot): string {
  const content = renderNodeOverlay(snapshot.tree, 0);

  return `<g class="gofish-debug-overlay" data-debug-overlay="bounds">
  ${content}
</g>`;
}
