import type { Meta, StoryObj } from "@storybook/html";
import { initializeContainer } from "../helper";
import { seafood } from "../../src/data/catch";
import { streamgraphData } from "../../src/data/streamgraphData";
import { Chart, spread, scaffold, Layer, select } from "../../src/lib";
import { area, group } from "../../src/ast/marks/chart";

const meta: Meta = {
  title: "Forward Syntax V3/Ridgeline",
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

export const Default: StoryObj<Args> = {
  args: { w: 500, h: 300 },
  render: (args: Args) => {
    const container = initializeContainer();

    Layer([
      Chart(seafood)
        .flow(
          spread("lake", { dir: "x", spacing: 80 }),
          spread("species", { dir: "y", spacing: -16 })
        )
        .mark(scaffold({ h: "count", fill: "species" }).name("points")),
      Chart(select("points"))
        .flow(group("species"))
        .mark(area({ opacity: 0.8, mixBlendMode: "normal" })),
    ]).render(container, {
      w: args.w,
      h: args.h,
      axes: true,
    });

    return container;
  },
};

export const StreamgraphData: StoryObj<Args> = {
  args: { w: 500, h: 400 },
  render: (args: Args) => {
    const container = initializeContainer();

    Layer([
      Chart(streamgraphData)
        .flow(
          spread("x", { dir: "x" }),
          spread("c", { dir: "y", spacing: -10 })
        )
        .mark(scaffold({ h: "y", fill: "c" }).name("ridges")),
      Chart(select("ridges"))
        .flow(group("c"))
        .mark(area({ opacity: 0.7 })),
    ]).render(container, {
      w: args.w,
      h: args.h,
    });

    return container;
  },
};
