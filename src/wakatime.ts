import "dotenv/config";
import type { ActivityDay } from "./types/activityDay";

function getAuthToken(): string {
  const token = process.env.WAKATIME_TOKEN;
  if (!token) {
    throw new Error("WAKATIME_TOKEN is not set");
  }
  return token as string;
}

function getActivityData(token: string): Promise<ActivityDay[]> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 365);
  const start = startDate.toISOString().split("T")[0];
  const end = endDate.toISOString().split("T")[0];

  const url = `https://api.wakatime.com/api/v1/users/current/summaries?start=${start}&end=${end}`;

  const data = fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Basic ${Buffer.from(token).toString("base64")}`,
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error(
        `WakaTime API request failed with status ${response.status}`,
      );
    }
    return response.json();
  });

  const formattedData = data.then((data) => {
    const summaries = data.data;
    const activityDays: ActivityDay[] = [];
    summaries.forEach((summary: any) => {
      activityDays.push({
        date: summary.range.date,
        github: null,
        wakatime: summary.grand_total.total_seconds / 3600,
      });
    });
    return activityDays;
  });

  return formattedData;
}

export { getAuthToken, getActivityData };
