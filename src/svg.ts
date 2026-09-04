import getMergedActivityData from "./data";
import { ActivityDay } from "./types/activityDay";

import { writeFile } from "node:fs/promises";

const CELL_SIZE = 12;
const GAP = 3;
const STEP = CELL_SIZE + GAP;

const ghmax = 20;
const wtmax = 3;

function getDayColor(day: ActivityDay): string {
  const github = Math.min((day.github ?? 0) / ghmax, 1);
  const wakatime = Math.min((day.wakatime ?? 0) / wtmax, 1);

  const r = 0;
  const g = Math.round(255 * github);
  const b = Math.round(255 * wakatime);

  return `rgb(${r}, ${g}, ${b})`;
}

function generateSVG(activityData: ActivityDay[]): string {
  const cells = activityData
    .map((day, index) => {
      const week = Math.floor(index / 7);
      const weekday = index % 7;

      return `<rect
        x="${week * STEP}"
        y="${weekday * STEP}"
        width="${CELL_SIZE}"
        height="${CELL_SIZE}"
        fill="${getDayColor(day)}"
        rx="2"
      />`;
    })
    .join("\n");

  const width = Math.ceil(activityData.length / 7) * STEP - GAP;
  const height = 7 * STEP - GAP;

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
${cells}
</svg>`;
}

async function main() {
  const data = await getMergedActivityData();
  console.log(generateSVG(data));
  await writeFile("activity.svg", generateSVG(data));
}

main();
