export interface DebugSnapshot {
  version: 1;
  timestamp: number;
  renderOptions: { w: number; h: number; padding?: number };
  tree: DebugNode;
  scales: {
    color: Record<string, string>;
    position: { x?: DebugScale; y?: DebugScale };
    ordinal: { x?: string[]; y?: string[] };
  };
}

export interface DebugNode {
  uid: string;
  type: string;
  name?: string;
  key?: string;
  category: "shape" | "operator" | "transform" | "ref";
  intrinsicDims: { x: DimInfo; y: DimInfo };
  transform: { translate: [number, number]; scale?: [number, number] };
  globalBounds: { x: number; y: number; w: number; h: number };
  underlyingSpace: { x: SpaceInfo; y: SpaceInfo };
  dataBinding?: {
    field: string;
    rawValue: number | string;
    mappedValue: number;
    scaleDescription: string;
  };
  color?: { raw: string; resolved: string };
  children: DebugNode[];
}

export interface DimInfo {
  min: number;
  center: number;
  max: number;
  size: number;
  embedded: boolean;
  shared: boolean;
}

export interface SpaceInfo {
  kind: "position" | "ordinal" | "size" | "difference" | "undefined";
  domain?: [number, number] | string[];
  coordinateTransform?: string;
}

export interface DebugScale {
  domain: [number, number];
  range: [number, number];
  ticks: number[];
}

export interface DebugEventLog {
  version: 1;
  events: DebugEvent[];
}

export interface DebugEvent {
  pass:
    | "colorScale"
    | "names"
    | "keys"
    | "sizeDomains"
    | "underlyingSpace"
    | "posScales"
    | "layout"
    | "placement"
    | "render";
  nodeUid: string;
  nodeType: string;
  timestamp: number;
  message: string;
  data?: Record<string, unknown>;
}

export interface DebugData {
  snapshot: DebugSnapshot;
  events: DebugEventLog;
}
