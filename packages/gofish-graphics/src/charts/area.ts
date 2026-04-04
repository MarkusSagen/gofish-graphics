import {
  Chart,
  spread,
  stack,
  scaffold,
  select,
  area,
  ChartBuilder,
  Operator,
  Mark,
} from "../lib";
import { layer } from "../ast/graphicalOperators/layer";
import { Stackable } from "./stackable";

class AreaChartBuilder<TInput, TOutput = TInput>
  implements Stackable<TInput, TOutput>
{
  private readonly data: TInput;
  private readonly xField: keyof TOutput;
  private readonly yField: keyof TOutput;
  private readonly areaOptions: {
    opacity?: number;
    fill?: string;
    alignment?: "start" | "middle" | "end" | "baseline";
  };
  private readonly stackField?: keyof TOutput;

  constructor(
    data: TInput,
    xField: keyof TOutput,
    yField: keyof TOutput,
    areaOptions: {
      opacity?: number;
      fill?: string;
      alignment?: "start" | "middle" | "end" | "baseline";
    } = {},
    stackField?: keyof TOutput
  ) {
    this.data = data;
    this.xField = xField;
    this.yField = yField;
    this.areaOptions = areaOptions;
    this.stackField = stackField;
  }

  async resolve() {
    const operators: Operator<any, any>[] = [
      spread(this.xField, { dir: "x" } as any),
    ];

    if (this.stackField) {
      operators.push(
        stack(this.stackField, {
          dir: "y",
          alignment: this.areaOptions.alignment ?? "baseline",
        } as any)
      );
    }

    const scaffoldChart = Chart(this.data as any)
      .flow(...(operators as [any]))
      .mark(scaffold({ h: this.yField as string }).name("points"));

    const areaLayer = Chart(select("points") as any).mark(
      area({
        opacity: this.areaOptions.opacity ?? 0.8,
      }) as Mark<any>
    );

    return layer(
      {},
      await Promise.all([scaffoldChart.resolve(), areaLayer.resolve()])
    );
  }

  async render(
    container: HTMLElement,
    options: { w: number; h: number; axes?: boolean; [key: string]: any }
  ) {
    const node = await this.resolve();
    return node.render(container, options);
  }

  stack<K extends keyof TOutput>(
    field: K,
    options?: {
      alignment?: "start" | "middle" | "end";
    }
  ): AreaChartBuilder<TInput, TOutput> {
    return new AreaChartBuilder(
      this.data,
      this.xField,
      this.yField,
      { ...this.areaOptions, alignment: options?.alignment },
      field
    );
  }
}

export const areaChart = <T extends Record<string, any>>(
  data: T[],
  options: {
    x: keyof T;
    y: keyof T;
    opacity?: number;
    fill?: string;
    alignment?: "start" | "middle" | "end" | "baseline";
  }
) => {
  return new AreaChartBuilder<T[], T>(
    data,
    options.x as any,
    options.y as any,
    {
      opacity: options.opacity,
      fill: options.fill,
      alignment: options.alignment,
    }
  );
};
