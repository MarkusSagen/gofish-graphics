export const INSPECTOR_STYLES = `
  .gofish-inspector {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace;
    font-size: 13px;
    color: #e2e8f0;
    background: #0f172a;
    border: 1px solid #1e293b;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .gofish-inspector * { box-sizing: border-box; }

  /* Tab bar */
  .gofish-tabs {
    display: flex;
    border-bottom: 1px solid #1e293b;
    background: #1e293b;
    padding: 0 8px;
  }
  .gofish-tab {
    padding: 8px 16px;
    cursor: pointer;
    color: #64748b;
    border-bottom: 2px solid transparent;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    user-select: none;
  }
  .gofish-tab:hover { color: #94a3b8; }
  .gofish-tab.active {
    color: #f59e0b;
    border-bottom-color: #f59e0b;
  }

  /* Tab content */
  .gofish-tab-content {
    display: none;
    flex: 1;
    overflow: hidden;
  }
  .gofish-tab-content.active {
    display: flex;
  }

  /* Tree tab layout */
  .gofish-tree-layout {
    display: flex;
    flex: 1;
    overflow: hidden;
  }
  .gofish-tree-panel {
    flex: 0 0 280px;
    border-right: 1px solid #1e293b;
    overflow-y: auto;
    padding: 8px;
  }
  .gofish-detail-panel {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
  }

  /* Tree nodes */
  .gofish-tree-node {
    padding: 1px 0;
  }
  .gofish-tree-node-header {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 2px 4px;
    border-radius: 3px;
    cursor: pointer;
    white-space: nowrap;
  }
  .gofish-tree-node-header:hover {
    background: #1e293b;
  }
  .gofish-tree-node-header.selected {
    background: #1e3a5f;
  }
  .gofish-tree-toggle {
    width: 16px;
    text-align: center;
    color: #475569;
    font-size: 10px;
    flex-shrink: 0;
  }
  .gofish-tree-type {
    font-weight: 600;
  }
  .gofish-tree-type.operator { color: #f59e0b; }
  .gofish-tree-type.shape { color: #10b981; }
  .gofish-tree-type.transform { color: #3b82f6; }
  .gofish-tree-type.ref { color: #6b7280; }
  .gofish-tree-name {
    color: #94a3b8;
    font-size: 11px;
  }
  .gofish-tree-key {
    color: #a855f7;
    font-size: 11px;
  }
  .gofish-tree-children {
    padding-left: 16px;
  }
  .gofish-tree-children.collapsed {
    display: none;
  }

  /* Detail panel */
  .gofish-detail-section {
    margin-bottom: 12px;
  }
  .gofish-detail-label {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #64748b;
    margin-bottom: 4px;
  }
  .gofish-detail-row {
    display: flex;
    gap: 8px;
    padding: 2px 0;
    font-size: 12px;
  }
  .gofish-detail-key {
    color: #64748b;
    min-width: 80px;
  }
  .gofish-detail-value {
    color: #e2e8f0;
  }
  .gofish-detail-value.position { color: #3b82f6; }
  .gofish-detail-value.ordinal { color: #a855f7; }
  .gofish-detail-value.size { color: #f59e0b; }
  .gofish-detail-value.undefined { color: #6b7280; }

  /* Breadcrumb */
  .gofish-breadcrumb {
    padding: 6px 12px;
    font-size: 11px;
    color: #64748b;
    border-bottom: 1px solid #1e293b;
    background: #0f172a;
  }
  .gofish-breadcrumb span { color: #94a3b8; }
  .gofish-breadcrumb .sep { color: #475569; margin: 0 4px; }

  /* Snapshot tab */
  .gofish-snapshot {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .gofish-snapshot-toolbar {
    display: flex;
    gap: 8px;
    padding: 8px 12px;
    border-bottom: 1px solid #1e293b;
  }
  .gofish-snapshot-btn {
    padding: 4px 12px;
    background: #1e293b;
    color: #94a3b8;
    border: 1px solid #334155;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
  }
  .gofish-snapshot-btn:hover {
    background: #334155;
    color: #e2e8f0;
  }
  .gofish-snapshot-json {
    flex: 1;
    overflow: auto;
    padding: 12px;
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 11px;
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-all;
    color: #e2e8f0;
    background: #020617;
    margin: 0;
  }

  /* JSON syntax highlighting */
  .json-key { color: #7dd3fc; }
  .json-string { color: #86efac; }
  .json-number { color: #fbbf24; }
  .json-boolean { color: #c084fc; }
  .json-null { color: #6b7280; }
`;
