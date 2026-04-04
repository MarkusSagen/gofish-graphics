import {
  Chart,
  spread,
  scaffold,
  select,
  line,
  ChartBuilder,
  Operator,
  Mark,
} from "../lib";
import { layer } from "../ast/graphicalOperators/layer";
import { Stackable } from "./stackable";

class LineChartBuilder<TInput, TOutput = TInput>
  implements Stackable<TInput, TOutput>
{
  private charts: ChartBuilder<any, any>[];

  constructor(charts: ChartBuilder<any, any>[]) {
    this.charts = charts;
  }

  async resolve() {
    return layer({}, await Promise.all(this.charts.map((c) => c.resolve())));
  }

  async render(
    container: HTMLElement,
    options: { w: number; h: number; axes?: boolean; [key: string]: any }
  ) {
    const node = await this.resolve();
    return node.render(container, options);
  }

  stack<K extends keyof TOutput>(
    _field: K,
    _options?: {
      alignment?: "start" | "middle" | "end";
    }
  ): LineChartBuilder<TInput, TOutput> {
    // For line charts, stacking is not typical — return self unchanged
    return this;
  }
}

export const lineChart = <T extends Record<string, any>>(
  data: T[],
  options: {
    x: keyof T;
    y: keyof T;
    stroke?: string;
    strokeWidth?: number;
  }
) => {
  const scaffoldChart = Chart(data)
    .flow(spread(options.x, { dir: "x" }))
    .mark(scaffold({ h: options.y as string }).name("points"));

  const lineLayer = Chart(select("points") as any).mark(
    line({
      stroke: options.stroke,
      strokeWidth: options.strokeWidth ?? 2,
    }) as Mark<any>
  );

  return new LineChartBuilder([scaffoldChart, lineLayer] as any);
};
