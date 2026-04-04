import {
  Chart,
  spread,
  scaffold,
  select,
  line,
  ChartBuilder,
  Mark,
} from "../lib";
import { group } from "../ast/marks/chart";
import { layer } from "../ast/graphicalOperators/layer";

class LineChartBuilder<TInput, TOutput = TInput> {
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
}

export const lineChart = <T extends Record<string, any>>(
  data: T[],
  options: {
    x: keyof T;
    y: keyof T;
    color?: keyof T;
    stroke?: string;
    strokeWidth?: number;
  }
) => {
  const scaffoldChart = Chart(data)
    .flow(spread(options.x, { dir: "x" }))
    .mark(
      scaffold({
        h: options.y as string,
        fill: options.color as string | undefined,
      }).name("points")
    );

  let lineLayer = Chart(select("points") as any);
  if (options.color) {
    lineLayer = lineLayer.flow(group(options.color) as any);
  }

  const lineMark = lineLayer.mark(
    line({
      stroke: options.stroke,
      strokeWidth: options.strokeWidth ?? 2,
    }) as Mark<any>
  );

  return new LineChartBuilder([scaffoldChart, lineMark] as any);
};
