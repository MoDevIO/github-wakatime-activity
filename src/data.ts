import { ActivityDay } from "./types/activityDay";

import * as github from "./github";
import * as wakatime from "./wakatime";

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function getFixedDates(): string[] {
  const today = new Date();

  const end = new Date(today);
  const daysUntilSunday = 7 - end.getUTCDay();
  end.setUTCDate(end.getUTCDate() + daysUntilSunday);

  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 363);

  const dates: string[] = [];

  for (
    let date = new Date(start);
    date <= end;
    date.setUTCDate(date.getUTCDate() + 1)
  ) {
    dates.push(formatDate(date));
  }

  return dates;
}

async function getMergedActivityData(): Promise<ActivityDay[]> {
  const [githubData, wakatimeData] = await Promise.all([
    github.getActivityData(github.getAuthToken()),
    wakatime.getActivityData(wakatime.getAuthToken()),
  ]);

  const githubByDate = new Map(githubData.map((day) => [day.date, day]));
  const wakatimeByDate = new Map(wakatimeData.map((day) => [day.date, day]));

  return getFixedDates().map((date) => ({
    date,
    github: githubByDate.get(date)?.github ?? 0,
    wakatime: wakatimeByDate.get(date)?.wakatime ?? 0,
  }));
}

export default getMergedActivityData;
