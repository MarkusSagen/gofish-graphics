import { Chart, stack, rect, ChartBuilder } from "../lib";
import { clock } from "../ast/coordinateTransforms/clock";

export const pieChart = <T extends Record<string, any>>(
  data: T[],
  options: {
    theta: keyof T;
    size: keyof T;
    fill?: keyof T | string;
  }
) => {
  const fillField = options.fill ?? options.theta;

  return Chart(data, { coord: clock() })
    .flow(stack(options.theta, { dir: "x" }))
    .mark(
      rect({
        w: options.size as string,
        fill: fillField as string,
      })
    );
};

export const donutChart = <T extends Record<string, any>>(
  data: T[],
  options: {
    theta: keyof T;
    size: keyof T;
    fill?: keyof T | string;
    innerRadius?: number;
    outerRadius?: number;
  }
) => {
  const fillField = options.fill ?? options.theta;
  const inner = options.innerRadius ?? 50;
  const outer = options.outerRadius ?? 50;

  return Chart(data, { coord: clock() })
    .flow(stack(options.theta, { dir: "x", y: inner, h: outer } as any))
    .mark(
      rect({
        w: options.size as string,
        fill: fillField as string,
      })
    );
};
