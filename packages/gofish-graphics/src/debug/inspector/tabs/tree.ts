import type { DebugNode } from "../../types";

function renderTreeNode(node: DebugNode, depth: number): string {
  const hasChildren = node.children.length > 0;
  const toggle = hasChildren
    ? `<span class="gofish-tree-toggle" data-uid="${node.uid}">▼</span>`
    : `<span class="gofish-tree-toggle"></span>`;

  const nameLabel = node.name
    ? `<span class="gofish-tree-name">(${node.name})</span>`
    : "";
  const keyLabel = node.key
    ? `<span class="gofish-tree-key">[${node.key}]</span>`
    : "";

  const children = hasChildren
    ? `<div class="gofish-tree-children" data-parent-uid="${node.uid}">
        ${node.children.map((c) => renderTreeNode(c, depth + 1)).join("")}
      </div>`
    : "";

  return `<div class="gofish-tree-node">
    <div class="gofish-tree-node-header" data-uid="${node.uid}" data-type="${node.type}" data-category="${node.category}">
      ${toggle}
      <span class="gofish-tree-type ${node.category}">${node.type}</span>
      ${nameLabel}
      ${keyLabel}
    </div>
    ${children}
  </div>`;
}

function renderDetailPanel(): string {
  return `<div class="gofish-detail-panel" id="gofish-detail">
    <div style="color:#64748b;padding:20px;text-align:center">
      Click a node in the tree to inspect it
    </div>
  </div>`;
}

function renderDetailForNode(node: DebugNode): string {
  const spaceClass = (kind: string) => {
    if (kind === "position") return "position";
    if (kind === "ordinal") return "ordinal";
    if (kind === "size") return "size";
    return "undefined";
  };

  const formatDomain = (space: { kind: string; domain?: unknown }) => {
    if (!space.domain) return "";
    if (Array.isArray(space.domain)) {
      return ` [${space.domain.join(", ")}]`;
    }
    return "";
  };

  let dataBindingHtml = "";
  if (node.dataBinding) {
    dataBindingHtml = `
      <div class="gofish-detail-section">
        <div class="gofish-detail-label">Data Binding</div>
        <div class="gofish-detail-row">
          <span class="gofish-detail-key">field:</span>
          <span class="gofish-detail-value">${node.dataBinding.field}</span>
        </div>
        <div class="gofish-detail-row">
          <span class="gofish-detail-key">raw:</span>
          <span class="gofish-detail-value">${node.dataBinding.rawValue}</span>
        </div>
        <div class="gofish-detail-row">
          <span class="gofish-detail-key">mapped:</span>
          <span class="gofish-detail-value">${node.dataBinding.mappedValue}</span>
        </div>
      </div>`;
  }

  let colorHtml = "";
  if (node.color) {
    colorHtml = `
      <div class="gofish-detail-section">
        <div class="gofish-detail-label">Color</div>
        <div class="gofish-detail-row">
          <span class="gofish-detail-key">raw:</span>
          <span class="gofish-detail-value">${node.color.raw}</span>
        </div>
        <div class="gofish-detail-row">
          <span class="gofish-detail-key">resolved:</span>
          <span class="gofish-detail-value">
            <span style="display:inline-block;width:12px;height:12px;background:${node.color.resolved};border-radius:2px;vertical-align:middle;margin-right:4px"></span>
            ${node.color.resolved}
          </span>
        </div>
      </div>`;
  }

  return `
    <div class="gofish-detail-section">
      <div class="gofish-detail-label">Identity</div>
      <div class="gofish-detail-row">
        <span class="gofish-detail-key">type:</span>
        <span class="gofish-detail-value gofish-tree-type ${node.category}">${node.type}</span>
      </div>
      <div class="gofish-detail-row">
        <span class="gofish-detail-key">uid:</span>
        <span class="gofish-detail-value">${node.uid}</span>
      </div>
      ${node.name ? `<div class="gofish-detail-row"><span class="gofish-detail-key">name:</span><span class="gofish-detail-value">${node.name}</span></div>` : ""}
      ${node.key ? `<div class="gofish-detail-row"><span class="gofish-detail-key">key:</span><span class="gofish-detail-value gofish-tree-key">${node.key}</span></div>` : ""}
    </div>

    <div class="gofish-detail-section">
      <div class="gofish-detail-label">Dimensions</div>
      <div class="gofish-detail-row">
        <span class="gofish-detail-key">x:</span>
        <span class="gofish-detail-value">min=${node.intrinsicDims.x.min.toFixed(1)} center=${node.intrinsicDims.x.center.toFixed(1)} max=${node.intrinsicDims.x.max.toFixed(1)} size=${node.intrinsicDims.x.size.toFixed(1)}${node.intrinsicDims.x.embedded ? " [embedded]" : ""}</span>
      </div>
      <div class="gofish-detail-row">
        <span class="gofish-detail-key">y:</span>
        <span class="gofish-detail-value">min=${node.intrinsicDims.y.min.toFixed(1)} center=${node.intrinsicDims.y.center.toFixed(1)} max=${node.intrinsicDims.y.max.toFixed(1)} size=${node.intrinsicDims.y.size.toFixed(1)}${node.intrinsicDims.y.embedded ? " [embedded]" : ""}</span>
      </div>
    </div>

    <div class="gofish-detail-section">
      <div class="gofish-detail-label">Transform</div>
      <div class="gofish-detail-row">
        <span class="gofish-detail-key">translate:</span>
        <span class="gofish-detail-value">[${node.transform.translate[0].toFixed(1)}, ${node.transform.translate[1].toFixed(1)}]</span>
      </div>
      ${node.transform.scale ? `<div class="gofish-detail-row"><span class="gofish-detail-key">scale:</span><span class="gofish-detail-value">[${node.transform.scale[0]}, ${node.transform.scale[1]}]</span></div>` : ""}
    </div>

    <div class="gofish-detail-section">
      <div class="gofish-detail-label">Global Bounds</div>
      <div class="gofish-detail-row">
        <span class="gofish-detail-key">position:</span>
        <span class="gofish-detail-value">(${node.globalBounds.x.toFixed(1)}, ${node.globalBounds.y.toFixed(1)})</span>
      </div>
      <div class="gofish-detail-row">
        <span class="gofish-detail-key">size:</span>
        <span class="gofish-detail-value">${node.globalBounds.w.toFixed(1)} × ${node.globalBounds.h.toFixed(1)}</span>
      </div>
    </div>

    <div class="gofish-detail-section">
      <div class="gofish-detail-label">Underlying Space</div>
      <div class="gofish-detail-row">
        <span class="gofish-detail-key">x:</span>
        <span class="gofish-detail-value ${spaceClass(node.underlyingSpace.x.kind)}">${node.underlyingSpace.x.kind.toUpperCase()}${formatDomain(node.underlyingSpace.x)}</span>
      </div>
      <div class="gofish-detail-row">
        <span class="gofish-detail-key">y:</span>
        <span class="gofish-detail-value ${spaceClass(node.underlyingSpace.y.kind)}">${node.underlyingSpace.y.kind.toUpperCase()}${formatDomain(node.underlyingSpace.y)}</span>
      </div>
    </div>

    ${dataBindingHtml}
    ${colorHtml}
  `;
}

export function renderTreeTab(tree: DebugNode): string {
  return `<div class="gofish-tree-layout">
    <div class="gofish-tree-panel">
      ${renderTreeNode(tree, 0)}
    </div>
    ${renderDetailPanel()}
  </div>`;
}

export { renderDetailForNode };
