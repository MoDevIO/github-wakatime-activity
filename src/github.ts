import "dotenv/config";
import type { ActivityDay } from "./types/activityDay";

function getAuthToken(): string {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN is not set");
  }
  return token as string;
}

async function getActivityData(token: string): Promise<ActivityDay[]> {
  const url = `https://api.github.com/graphql`;
  const query = `
    query {
      viewer {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;
  const data = fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(
        `GitHub API request failed with status ${response.status}`,
      );
    }
    return response.json();
  });

  const formattedData = data.then((data) => {
    const weeks =
      data.data.viewer.contributionsCollection.contributionCalendar.weeks;
    const activityDays: ActivityDay[] = [];
    weeks.forEach((week: any) => {
      week.contributionDays.forEach((day: any) => {
        activityDays.push({
          date: day.date,
          github: day.contributionCount,
          wakatime: null,
        });
      });
    });
    return activityDays;
  });

  return formattedData;
}

export { getAuthToken, getActivityData };
