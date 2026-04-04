import type { Meta, StoryObj } from "@storybook/html";
import { initializeContainer } from "../helper";
import { barChart } from "../../src/charts/bar";
import { lineChart } from "../../src/charts/line";
import { scatterChart } from "../../src/charts/scatter";
import { areaChart } from "../../src/charts/area";
import { pieChart } from "../../src/charts/pie";
import { fishData } from "../../src/data/fish";
import { catchLocationsArray } from "../../src/data/catch";

const meta: Meta = {
  title: "Forward Syntax V3/High-Level API",
  argTypes: {
    w: {
      control: { type: "number", min: 100, max: 1000, step: 10 },
    },
    h: {
      control: { type: "number", min: 100, max: 1000, step: 10 },
    },
  },
};
export default meta;

type Args = { w: number; h: number };

const simpleData = [
  { category: "A", value: 30 },
  { category: "B", value: 80 },
  { category: "C", value: 45 },
  { category: "D", value: 60 },
  { category: "E", value: 20 },
];

const timeSeriesData = [
  { month: "Jan", sales: 30 },
  { month: "Feb", sales: 45 },
  { month: "Mar", sales: 60 },
  { month: "Apr", sales: 40 },
  { month: "May", sales: 75 },
  { month: "Jun", sales: 55 },
];

export const BarChart: StoryObj<Args> = {
  args: { w: 500, h: 400 },
  render: (args: Args) => {
    const container = initializeContainer();
    barChart(simpleData, { x: "category", y: "value" }).render(container, {
      w: args.w,
      h: args.h,
      axes: true,
    });
    return container;
  },
};

export const BarChartWithFill: StoryObj<Args> = {
  args: { w: 500, h: 400 },
  render: (args: Args) => {
    const container = initializeContainer();
    barChart(simpleData, {
      x: "category",
      y: "value",
      fill: "#4ecdc4",
    }).render(container, {
      w: args.w,
      h: args.h,
      axes: true,
    });
    return container;
  },
};

export const BarChartHorizontal: StoryObj<Args> = {
  args: { w: 500, h: 400 },
  render: (args: Args) => {
    const container = initializeContainer();
    barChart(simpleData, {
      x: "value",
      y: "category",
      orientation: "x",
    }).render(container, {
      w: args.w,
      h: args.h,
      axes: true,
    });
    return container;
  },
};

export const StackedBarChart: StoryObj<Args> = {
  args: { w: 500, h: 400 },
  render: (args: Args) => {
    const container = initializeContainer();
    barChart(fishData, { x: "Lake", y: "Count", fill: "Fish Type" })
      .stack("Fish Type")
      .render(container, {
        w: args.w,
        h: args.h,
        axes: true,
      });
    return container;
  },
};

export const LineChart: StoryObj<Args> = {
  args: { w: 500, h: 400 },
  render: (args: Args) => {
    const container = initializeContainer();
    lineChart(timeSeriesData, {
      x: "month",
      y: "sales",
    }).render(container, {
      w: args.w,
      h: args.h,
      axes: true,
    });
    return container;
  },
};

export const LineChartStyled: StoryObj<Args> = {
  args: { w: 500, h: 400 },
  render: (args: Args) => {
    const container = initializeContainer();
    lineChart(timeSeriesData, {
      x: "month",
      y: "sales",
      stroke: "#ff6b6b",
      strokeWidth: 3,
    }).render(container, {
      w: args.w,
      h: args.h,
      axes: true,
    });
    return container;
  },
};

export const ScatterChart: StoryObj<Args> = {
  args: { w: 500, h: 400 },
  render: (args: Args) => {
    const container = initializeContainer();
    scatterChart(catchLocationsArray, {
      x: "x",
      y: "y",
    }).render(container, {
      w: args.w,
      h: args.h,
      axes: true,
    });
    return container;
  },
};

export const ScatterChartWithColor: StoryObj<Args> = {
  args: { w: 500, h: 400 },
  render: (args: Args) => {
    const container = initializeContainer();
    scatterChart(catchLocationsArray, {
      x: "x",
      y: "y",
      r: 8,
      fill: "lake",
    }).render(container, {
      w: args.w,
      h: args.h,
      axes: true,
    });
    return container;
  },
};

export const AreaChart: StoryObj<Args> = {
  args: { w: 500, h: 400 },
  render: (args: Args) => {
    const container = initializeContainer();
    areaChart(timeSeriesData, {
      x: "month",
      y: "sales",
      opacity: 0.6,
    }).render(container, {
      w: args.w,
      h: args.h,
      axes: true,
    });
    return container;
  },
};

export const StackedAreaChart: StoryObj<Args> = {
  args: { w: 500, h: 400 },
  render: (args: Args) => {
    const container = initializeContainer();
    areaChart(fishData, {
      x: "Lake",
      y: "Count",
    })
      .stack("Fish Type")
      .render(container, {
        w: args.w,
        h: args.h,
        axes: true,
      });
    return container;
  },
};

export const PieChart: StoryObj<Args> = {
  args: { w: 400, h: 400 },
  render: (args: Args) => {
    const container = initializeContainer();
    pieChart(simpleData, {
      theta: "category",
      size: "value",
    }).render(container, {
      w: args.w,
      h: args.h,
    });
    return container;
  },
};

export const PieChartWithFill: StoryObj<Args> = {
  args: { w: 400, h: 400 },
  render: (args: Args) => {
    const container = initializeContainer();
    pieChart(simpleData, {
      theta: "category",
      size: "value",
      fill: "category",
    }).render(container, {
      w: args.w,
      h: args.h,
    });
    return container;
  },
};
