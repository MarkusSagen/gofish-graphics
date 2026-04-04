import { Chart, scatter, circle, ChartBuilder } from "../lib";

export const scatterChart = <T extends Record<string, any>>(
  data: T[],
  options: {
    x: keyof T;
    y: keyof T;
    r?: number;
    fill?: keyof T | string;
  }
) => {
  return Chart(data)
    .flow(scatter(options.x, { x: options.x, y: options.y }))
    .mark(
      circle({
        r: options.r ?? 5,
        fill: options.fill as string | undefined,
      })
    );
};
