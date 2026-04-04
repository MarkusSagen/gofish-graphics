import type { DebugEvent, DebugEventLog } from "./types";

export class DebugCollector {
  private events: DebugEvent[] = [];
  private counter = 0;

  emit(
    pass: DebugEvent["pass"],
    nodeUid: string,
    nodeType: string,
    message: string,
    data?: Record<string, unknown>
  ): void {
    this.events.push({
      pass,
      nodeUid,
      nodeType,
      timestamp: this.counter++,
      message,
      data,
    });
  }

  getEventLog(): DebugEventLog {
    return {
      version: 1,
      events: [...this.events],
    };
  }

  getEventsForNode(nodeUid: string): DebugEvent[] {
    return this.events.filter((e) => e.nodeUid === nodeUid);
  }

  getEventsForPass(pass: DebugEvent["pass"]): DebugEvent[] {
    return this.events.filter((e) => e.pass === pass);
  }
}
