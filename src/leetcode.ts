import "dotenv/config";
import { ActivityDay } from "./types/activityDay";

type LeetCodeResponse = {
  data?: {
    matchedUser?: {
      userCalendar?: {
        submissionCalendar: string;
      };
    };
  };
};

async function getActivityData(): Promise<ActivityDay[]> {
  const username = process.env.LEETCODE_USERNAME;

  if (!username) {
    throw new Error("LEETCODE_USERNAME environment variable is not set.");
  }

  const response = await fetch(`https://leetcode.com/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referer: `https://leetcode.com/${username}/`,
    },
    body: JSON.stringify({
      query: `
        query userProfileCalendar($username: String!, $year: Int) {
            matchedUser(username: $username) {
              userCalendar(year: $year) {
                submissionCalendar
              }
            }
          }
      `,
      variables: {
        username,
        year: null,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch data from LeetCode: ${response.statusText}`,
    );
  }

  const result = (await response.json()) as LeetCodeResponse;
  const calendar = result.data?.matchedUser?.userCalendar?.submissionCalendar;

  if (!calendar) {
    throw new Error(
      "Failed to retrieve submission calendar from LeetCode response.",
    );
  }

  const submissions = JSON.parse(calendar) as Record<string, number>;

  return Object.entries(submissions).map(([timestamp, count]) => ({
    date: new Date(parseInt(timestamp) * 1000).toISOString().split("T")[0],
    github: null,
    wakatime: null,
    leetcode: count,
  }));
}

export { getActivityData };
