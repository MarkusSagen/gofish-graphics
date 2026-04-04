import type { Meta, StoryObj } from "@storybook/html";
import { chart, spread, rect } from "../src/ast/marks/chart";
import { inspect } from "../src/debug/inspector/index";

const data = [
  { category: "A", value: 28 },
  { category: "B", value: 55 },
  { category: "C", value: 43 },
  { category: "D", value: 91 },
  { category: "E", value: 81 },
  { category: "F", value: 53 },
  { category: "G", value: 19 },
  { category: "H", value: 87 },
  { category: "I", value: 52 },
];

const meta: Meta = {
  title: "Debug/Inspector",
};
export default meta;

export const BasicBarChart: StoryObj = {
  render: () => {
    const container = document.createElement("div");
    container.style.margin = "20px";

    chart(data)
      .flow(spread("category", { dir: "x" }))
      .mark(rect({ h: "value" }))
      .debug({ w: 400, h: 300 })
      .then((debugData) => {
        const inspector = inspect(debugData);
        container.appendChild(inspector);
      });

    return container;
  },
};

export const WithOptions: StoryObj = {
  render: () => {
    const container = document.createElement("div");
    container.style.margin = "20px";

    chart(data)
      .flow(spread("category", { dir: "x" }))
      .mark(rect({ h: "value" }).name("bars"))
      .debug({ w: 600, h: 400, padding: 40 })
      .then((debugData) => {
        const inspector = inspect(debugData);
        container.appendChild(inspector);
      });

    return container;
  },
};
