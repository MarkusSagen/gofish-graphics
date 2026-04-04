import { GoFishNode, RenderSession } from "../ast/_node";
import { GoFishAST } from "../ast/_ast";
import { GoFishRef } from "../ast/_ref";
import {
  UnderlyingSpace,
  isPOSITION,
  isORDINAL,
  isDIFFERENCE,
  isSIZE,
} from "../ast/underlyingSpace";
import type { Size } from "../ast/dims";
import type { DebugNode, DebugSnapshot, DimInfo, SpaceInfo } from "./types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Type guard distinguishing GoFishNode from GoFishRef without importing the
 *  private `isGoFishNode` from _node.ts. */
function isGoFishNode(node: GoFishAST): node is GoFishNode {
  return node instanceof GoFishNode;
}

const OPERATOR_TYPES = new Set([
  "spread",
  "spreadX",
  "spreadY",
  "stack",
  "stackX",
  "stackY",
  "layer",
  "wrap",
  "connect",
  "connectX",
  "connectY",
  "frame",
  "position",
  "enclose",
  "arrow",
  "table",
]);

const TRANSFORM_TYPES = new Set(["coord"]);

const SHAPE_TYPES = new Set([
  "rect",
  "ellipse",
  "circle",
  "petal",
  "text",
  "line",
  "area",
  "scaffold",
  "ref",
]);

/** Maps a node type string to its debug category. */
function categorizeNode(
  node: GoFishAST
): "shape" | "operator" | "transform" | "ref" {
  if (node instanceof GoFishRef) return "ref";
  const t = node.type;
  if (TRANSFORM_TYPES.has(t)) return "transform";
  if (OPERATOR_TYPES.has(t)) return "operator";
  if (SHAPE_TYPES.has(t)) return "shape";
  // Fall back: nodes with children are operators, leaf nodes are shapes.
  if (isGoFishNode(node) && node.children.length > 0) return "operator";
  return "shape";
}

/** Converts a single UnderlyingSpace value into SpaceInfo. */
function serializeSpace(space: UnderlyingSpace): SpaceInfo {
  if (isPOSITION(space)) {
    const info: SpaceInfo = {
      kind: "position",
      domain: [space.domain.min, space.domain.max],
    };
    if (space.coordinateTransform) {
      // CoordinateTransform doesn't have a stable string representation so we
      // record its constructor name as a hint.
      info.coordinateTransform =
        (space.coordinateTransform as any).name ??
        (space.coordinateTransform as any).type ??
        "unknown";
    }
    return info;
  }
  if (isORDINAL(space)) {
    return {
      kind: "ordinal",
      domain: space.domain ?? [],
    };
  }
  if (isDIFFERENCE(space)) {
    return { kind: "difference", domain: [0, space.width] };
  }
  if (isSIZE(space)) {
    return { kind: "size", domain: [0, space.value] };
  }
  return { kind: "undefined" };
}

/** Converts a single Interval (dimension) entry into a DimInfo, supplying
 *  safe numeric defaults so the output is always fully populated. */
function serializeDim(
  dim:
    | {
        min?: number;
        center?: number;
        max?: number;
        size?: number;
        embedded?: boolean;
      }
    | undefined,
  shared: boolean
): DimInfo {
  const min = dim?.min ?? 0;
  const max = dim?.max ?? 0;
  const size = dim?.size ?? max - min;
  const center = dim?.center ?? min + size / 2;
  return {
    min,
    center,
    max,
    size,
    embedded: dim?.embedded ?? false,
    shared,
  };
}

/** Accumulates parent transforms to yield a global (root-space) bounding box.
 *
 *  parentTx / parentTy are the accumulated translations from root down to
 *  (but not including) the current node.
 */
function computeGlobalBounds(
  node: GoFishNode,
  parentTx: number,
  parentTy: number
): { x: number; y: number; w: number; h: number } {
  const tx = parentTx + (node.transform?.translate?.[0] ?? 0);
  const ty = parentTy + (node.transform?.translate?.[1] ?? 0);
  const intrinsicX = node.intrinsicDims?.[0];
  const intrinsicY = node.intrinsicDims?.[1];
  const x = tx + (intrinsicX?.min ?? 0);
  const y = ty + (intrinsicY?.min ?? 0);
  const w = intrinsicX?.size ?? (intrinsicX?.max ?? 0) - (intrinsicX?.min ?? 0);
  const h = intrinsicY?.size ?? (intrinsicY?.max ?? 0) - (intrinsicY?.min ?? 0);
  return { x, y, w, h };
}

// ---------------------------------------------------------------------------
// Main recursive serializer
// ---------------------------------------------------------------------------

function serializeNode(
  node: GoFishAST,
  parentTx: number,
  parentTy: number,
  session?: RenderSession
): DebugNode {
  // ---- Handle GoFishRef (lightweight placeholder) -------------------------
  if (!isGoFishNode(node)) {
    return {
      uid: node.uid,
      type: node.type,
      name: node.name,
      key: undefined,
      category: "ref",
      intrinsicDims: {
        x: serializeDim(undefined, false),
        y: serializeDim(undefined, false),
      },
      transform: { translate: [0, 0] },
      globalBounds: { x: parentTx, y: parentTy, w: 0, h: 0 },
      underlyingSpace: { x: { kind: "undefined" }, y: { kind: "undefined" } },
      children: (node.children ?? []).map((child) =>
        serializeNode(child, parentTx, parentTy, session)
      ),
    };
  }

  // ---- GoFishNode -----------------------------------------------------------

  // Underlying space — may throw before layout is run; guard it.
  let underlyingSpace: Size<UnderlyingSpace> | undefined;
  try {
    underlyingSpace = node.resolveUnderlyingSpace();
  } catch {
    underlyingSpace = undefined;
  }

  const spaceX: SpaceInfo = underlyingSpace
    ? serializeSpace(underlyingSpace[0])
    : { kind: "undefined" };
  const spaceY: SpaceInfo = underlyingSpace
    ? serializeSpace(underlyingSpace[1])
    : { kind: "undefined" };

  // Intrinsic dims
  const dimX = node.intrinsicDims?.[0];
  const dimY = node.intrinsicDims?.[1];
  const sharedX = node.shared?.[0] ?? false;
  const sharedY = node.shared?.[1] ?? false;

  // Transform
  const translateX = node.transform?.translate?.[0] ?? 0;
  const translateY = node.transform?.translate?.[1] ?? 0;
  const scaleX = node.transform?.scale?.[0];
  const scaleY = node.transform?.scale?.[1];

  // Global bounds
  const globalBounds = computeGlobalBounds(node, parentTx, parentTy);

  // Accumulated translation for children
  const childTx = parentTx + translateX;
  const childTy = parentTy + translateY;

  // Color
  let colorInfo: DebugNode["color"] | undefined;
  if (node.color !== undefined) {
    const raw =
      typeof node.color === "object" &&
      node.color !== null &&
      "datum" in (node.color as any)
        ? String((node.color as any).datum)
        : String(node.color);

    // Attempt to look up resolved color from the session's scaleContext
    let resolved = raw;
    if (session) {
      try {
        const unit = session.scaleContext["unit"] as
          | { color: Map<any, string> }
          | undefined;
        if (unit?.color?.has(raw)) {
          resolved = unit.color.get(raw) ?? raw;
        }
      } catch {
        // ignore
      }
    }
    colorInfo = { raw, resolved };
  }

  const debugNode: DebugNode = {
    uid: node.uid,
    type: node.type,
    name: node._name,
    key: node.key,
    category: categorizeNode(node),
    intrinsicDims: {
      x: serializeDim(dimX, sharedX),
      y: serializeDim(dimY, sharedY),
    },
    transform: {
      translate: [translateX, translateY],
      ...(scaleX !== undefined && scaleY !== undefined
        ? { scale: [scaleX, scaleY] }
        : {}),
    },
    globalBounds,
    underlyingSpace: { x: spaceX, y: spaceY },
    color: colorInfo,
    children: node.children.map((child) =>
      serializeNode(child, childTx, childTy, session)
    ),
  };

  return debugNode;
}

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------

/** Serializes a post-layout GoFishNode tree into a DebugSnapshot.
 *
 * @param root          The root node (already through the layout pass).
 * @param renderOptions Width and height passed to render().
 * @param session       Optional RenderSession; used to extract color scales.
 */
export function serializeSnapshot(
  root: GoFishNode,
  renderOptions: { w: number; h: number; padding?: number },
  session?: RenderSession
): DebugSnapshot {
  const tree = serializeNode(root, 0, 0, session);

  // Extract color scale from session
  const colorRecord: Record<string, string> = {};
  if (session) {
    try {
      const unit = session.scaleContext["unit"] as
        | { color: Map<any, string> }
        | undefined;
      if (unit?.color) {
        for (const [key, value] of unit.color.entries()) {
          colorRecord[String(key)] = value;
        }
      }
    } catch {
      // No color scale available
    }
  }

  return {
    version: 1,
    timestamp: Date.now(),
    renderOptions,
    tree,
    scales: {
      color: colorRecord,
      position: {},
      ordinal: {},
    },
  };
}
