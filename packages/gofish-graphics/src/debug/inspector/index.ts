// packages/gofish-graphics/src/debug/inspector/index.ts

import type { DebugData } from "../types";
import {
  buildInspectorHtml,
  attachInspectorBehavior,
  type InspectOptions,
} from "./widget";

export function inspect(
  data: DebugData,
  options?: InspectOptions
): HTMLElement {
  const container = document.createElement("div");
  container.innerHTML = buildInspectorHtml(data, options);
  attachInspectorBehavior(container, data);
  return container;
}

/**
 * Returns the inspector as a self-contained HTML string.
 * Useful for Jupyter, Marimo, and other environments that display HTML.
 */
export function inspectHtml(data: DebugData, options?: InspectOptions): string {
  const innerHtml = buildInspectorHtml(data, options);
  const dataJson = JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e");

  // Self-contained HTML with inline script for interactivity
  // Uses vanilla JS (no framework) for maximum portability
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>GoFish Debug Inspector</title></head>
<body style="margin:0;background:#0f172a">
${innerHtml}
<script>
(function() {
  var data = ${dataJson};
  var container = document.querySelector('.gofish-inspector');
  if (!container) return;

  // Tab switching
  container.querySelectorAll('.gofish-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      container.querySelectorAll('.gofish-tab').forEach(function(t) { t.classList.remove('active'); });
      container.querySelectorAll('.gofish-tab-content').forEach(function(c) { c.classList.remove('active'); });
      tab.classList.add('active');
      var tabName = tab.dataset.tab;
      container.querySelector('[data-tab-content="' + tabName + '"]').classList.add('active');
    });
  });

  // Tree toggle
  container.querySelectorAll('.gofish-tree-toggle').forEach(function(toggle) {
    toggle.addEventListener('click', function(e) {
      e.stopPropagation();
      var uid = toggle.dataset.uid;
      if (!uid) return;
      var children = container.querySelector('[data-parent-uid="' + uid + '"]');
      if (children) {
        children.classList.toggle('collapsed');
        toggle.textContent = children.classList.contains('collapsed') ? String.fromCharCode(9654) : String.fromCharCode(9660);
      }
    });
  });

  // Tree selection helpers
  function findNode(node, uid) {
    if (node.uid === uid) return node;
    for (var i = 0; i < node.children.length; i++) {
      var found = findNode(node.children[i], uid);
      if (found) return found;
    }
    return null;
  }

  function buildBreadcrumb(node, uid, path) {
    path = path || [];
    if (node.uid === uid) return path.concat([node]);
    for (var i = 0; i < node.children.length; i++) {
      var result = buildBreadcrumb(node.children[i], uid, path.concat([node]));
      if (result) return result;
    }
    return null;
  }

  function spaceClass(kind) {
    if (kind === 'position') return 'position';
    if (kind === 'ordinal') return 'ordinal';
    if (kind === 'size') return 'size';
    return 'undefined';
  }
  function formatDomain(space) {
    if (!space.domain) return '';
    if (Array.isArray(space.domain)) return ' [' + space.domain.join(', ') + ']';
    return '';
  }

  function renderDetail(node) {
    var html = '<div class="gofish-detail-section">' +
      '<div class="gofish-detail-label">Identity</div>' +
      '<div class="gofish-detail-row"><span class="gofish-detail-key">type:</span><span class="gofish-detail-value gofish-tree-type ' + node.category + '">' + node.type + '</span></div>' +
      '<div class="gofish-detail-row"><span class="gofish-detail-key">uid:</span><span class="gofish-detail-value">' + node.uid + '</span></div>';
    if (node.name) html += '<div class="gofish-detail-row"><span class="gofish-detail-key">name:</span><span class="gofish-detail-value">' + node.name + '</span></div>';
    if (node.key) html += '<div class="gofish-detail-row"><span class="gofish-detail-key">key:</span><span class="gofish-detail-value gofish-tree-key">' + node.key + '</span></div>';
    html += '</div>';
    html += '<div class="gofish-detail-section"><div class="gofish-detail-label">Dimensions</div>' +
      '<div class="gofish-detail-row"><span class="gofish-detail-key">x:</span><span class="gofish-detail-value">size=' + node.intrinsicDims.x.size.toFixed(1) + (node.intrinsicDims.x.embedded ? ' [embedded]' : '') + '</span></div>' +
      '<div class="gofish-detail-row"><span class="gofish-detail-key">y:</span><span class="gofish-detail-value">size=' + node.intrinsicDims.y.size.toFixed(1) + (node.intrinsicDims.y.embedded ? ' [embedded]' : '') + '</span></div></div>';
    html += '<div class="gofish-detail-section"><div class="gofish-detail-label">Transform</div>' +
      '<div class="gofish-detail-row"><span class="gofish-detail-key">translate:</span><span class="gofish-detail-value">[' + node.transform.translate[0].toFixed(1) + ', ' + node.transform.translate[1].toFixed(1) + ']</span></div></div>';
    html += '<div class="gofish-detail-section"><div class="gofish-detail-label">Global Bounds</div>' +
      '<div class="gofish-detail-row"><span class="gofish-detail-key">position:</span><span class="gofish-detail-value">(' + node.globalBounds.x.toFixed(1) + ', ' + node.globalBounds.y.toFixed(1) + ')</span></div>' +
      '<div class="gofish-detail-row"><span class="gofish-detail-key">size:</span><span class="gofish-detail-value">' + node.globalBounds.w.toFixed(1) + ' x ' + node.globalBounds.h.toFixed(1) + '</span></div></div>';
    html += '<div class="gofish-detail-section"><div class="gofish-detail-label">Underlying Space</div>' +
      '<div class="gofish-detail-row"><span class="gofish-detail-key">x:</span><span class="gofish-detail-value ' + spaceClass(node.underlyingSpace.x.kind) + '">' + node.underlyingSpace.x.kind.toUpperCase() + formatDomain(node.underlyingSpace.x) + '</span></div>' +
      '<div class="gofish-detail-row"><span class="gofish-detail-key">y:</span><span class="gofish-detail-value ' + spaceClass(node.underlyingSpace.y.kind) + '">' + node.underlyingSpace.y.kind.toUpperCase() + formatDomain(node.underlyingSpace.y) + '</span></div></div>';
    return html;
  }

  // Tree node selection
  container.querySelectorAll('.gofish-tree-node-header').forEach(function(header) {
    header.addEventListener('click', function() {
      var uid = header.dataset.uid;
      if (!uid) return;
      container.querySelectorAll('.gofish-tree-node-header.selected').forEach(function(el) { el.classList.remove('selected'); });
      header.classList.add('selected');
      var node = findNode(data.snapshot.tree, uid);
      if (!node) return;
      var detail = container.querySelector('#gofish-detail');
      if (detail) detail.innerHTML = renderDetail(node);
      var bc = container.querySelector('#gofish-breadcrumb');
      if (bc) {
        var path = buildBreadcrumb(data.snapshot.tree, uid);
        if (path) {
          bc.innerHTML = path.map(function(n) { return '<span>' + n.type + (n.name ? ' (' + n.name + ')' : '') + '</span>'; }).join('<span class="sep">' + String.fromCharCode(8250) + '</span>');
        }
      }
    });
  });

  // Copy JSON
  var copyBtn = container.querySelector('#gofish-copy-json');
  if (copyBtn) copyBtn.addEventListener('click', function() {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  });

  // Download JSON
  var dlBtn = container.querySelector('#gofish-download-json');
  if (dlBtn) dlBtn.addEventListener('click', function() {
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'gofish-debug-' + Date.now() + '.json';
    a.click();
    URL.revokeObjectURL(url);
  });
})();
</script>
</body></html>`;
}
