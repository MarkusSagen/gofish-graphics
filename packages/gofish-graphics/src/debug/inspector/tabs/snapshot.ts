import type { DebugData } from "../../types";

function syntaxHighlightJson(json: string): string {
  return json.replace(
    /("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = "json-number";
      if (match.startsWith('"')) {
        cls = match.endsWith(":") ? "json-key" : "json-string";
      } else if (/true|false/.test(match)) {
        cls = "json-boolean";
      } else if (match === "null") {
        cls = "json-null";
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

export function renderSnapshotTab(data: DebugData): string {
  const jsonStr = JSON.stringify(data, null, 2);
  const highlighted = syntaxHighlightJson(
    jsonStr.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  );

  return `<div class="gofish-snapshot">
    <div class="gofish-snapshot-toolbar">
      <button class="gofish-snapshot-btn" id="gofish-copy-json">Copy JSON</button>
      <button class="gofish-snapshot-btn" id="gofish-download-json">Download JSON</button>
    </div>
    <pre class="gofish-snapshot-json">${highlighted}</pre>
  </div>`;
}
