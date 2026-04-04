// packages/gofish-graphics/src/debug/inspector/widget.ts

import type { DebugData, DebugNode } from "../types";
import { INSPECTOR_STYLES } from "./styles";
import { renderTreeTab, renderDetailForNode } from "./tabs/tree";
import { renderSnapshotTab } from "./tabs/snapshot";

export interface InspectOptions {
  theme?: "dark" | "light" | "auto";
  defaultTab?: "tree" | "snapshot";
  width?: string;
  height?: string;
}

function findNodeByUid(node: DebugNode, uid: string): DebugNode | null {
  if (node.uid === uid) return node;
  for (const child of node.children) {
    const found = findNodeByUid(child, uid);
    if (found) return found;
  }
  return null;
}

function buildBreadcrumb(
  node: DebugNode,
  targetUid: string,
  path: DebugNode[] = []
): DebugNode[] | null {
  if (node.uid === targetUid) return [...path, node];
  for (const child of node.children) {
    const result = buildBreadcrumb(child, targetUid, [...path, node]);
    if (result) return result;
  }
  return null;
}

export function buildInspectorHtml(
  data: DebugData,
  options: InspectOptions = {}
): string {
  const { defaultTab = "tree", width = "100%", height = "600px" } = options;

  const treeTab = renderTreeTab(data.snapshot.tree);
  const snapshotTab = renderSnapshotTab(data);

  return `<div class="gofish-inspector" style="width:${width};height:${height}">
    <style>${INSPECTOR_STYLES}</style>
    <div class="gofish-tabs">
      <div class="gofish-tab ${defaultTab === "tree" ? "active" : ""}" data-tab="tree">Tree</div>
      <div class="gofish-tab ${defaultTab === "snapshot" ? "active" : ""}" data-tab="snapshot">Snapshot</div>
    </div>
    <div class="gofish-breadcrumb" id="gofish-breadcrumb"></div>
    <div class="gofish-tab-content ${defaultTab === "tree" ? "active" : ""}" data-tab-content="tree">
      ${treeTab}
    </div>
    <div class="gofish-tab-content ${defaultTab === "snapshot" ? "active" : ""}" data-tab-content="snapshot">
      ${snapshotTab}
    </div>
  </div>`;
}

export function attachInspectorBehavior(
  container: HTMLElement,
  data: DebugData
): void {
  // Tab switching
  container.querySelectorAll<HTMLElement>(".gofish-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      container
        .querySelectorAll(".gofish-tab")
        .forEach((t) => t.classList.remove("active"));
      container
        .querySelectorAll(".gofish-tab-content")
        .forEach((c) => c.classList.remove("active"));
      tab.classList.add("active");
      const tabName = tab.dataset.tab!;
      container
        .querySelector(`[data-tab-content="${tabName}"]`)
        ?.classList.add("active");
    });
  });

  // Tree node toggle (expand/collapse)
  container
    .querySelectorAll<HTMLElement>(".gofish-tree-toggle")
    .forEach((toggle) => {
      toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const uid = toggle.dataset.uid;
        if (!uid) return;
        const children = container.querySelector<HTMLElement>(
          `[data-parent-uid="${uid}"]`
        );
        if (children) {
          children.classList.toggle("collapsed");
          toggle.textContent = children.classList.contains("collapsed")
            ? "▶"
            : "▼";
        }
      });
    });

  // Tree node selection
  container
    .querySelectorAll<HTMLElement>(".gofish-tree-node-header")
    .forEach((header) => {
      header.addEventListener("click", () => {
        const uid = header.dataset.uid;
        if (!uid) return;

        // Update selection highlight
        container
          .querySelectorAll(".gofish-tree-node-header.selected")
          .forEach((el) => el.classList.remove("selected"));
        header.classList.add("selected");

        // Find the node and update detail panel
        const node = findNodeByUid(data.snapshot.tree, uid);
        if (!node) return;

        const detailPanel =
          container.querySelector<HTMLElement>("#gofish-detail");
        if (detailPanel) {
          detailPanel.innerHTML = renderDetailForNode(node);
        }

        // Update breadcrumb
        const breadcrumb =
          container.querySelector<HTMLElement>("#gofish-breadcrumb");
        if (breadcrumb) {
          const path = buildBreadcrumb(data.snapshot.tree, uid);
          if (path) {
            breadcrumb.innerHTML = path
              .map(
                (n) => `<span>${n.type}${n.name ? ` (${n.name})` : ""}</span>`
              )
              .join('<span class="sep">›</span>');
          }
        }

        // Dispatch selection event for SVG overlay sync
        container.dispatchEvent(
          new CustomEvent("gofish-debug-select", {
            detail: { uid },
            bubbles: true,
          })
        );
      });
    });

  // Copy JSON button
  container
    .querySelector("#gofish-copy-json")
    ?.addEventListener("click", () => {
      navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    });

  // Download JSON button
  container
    .querySelector("#gofish-download-json")
    ?.addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `gofish-debug-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
}
