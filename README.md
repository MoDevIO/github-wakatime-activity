# GitHub WakaTime Activity

This tool generates an `activity.svg` containing the last 52 weeks of activity from:
- Github
- Wakatime
- Leetcode

## Example

<img src="./activity.svg">

## Usage

Create `.github/workflows/activity.yml` in the repository where you want `activity.svg`:
```
name: Update Activity

on:
  workflow_dispatch:
  schedule:
    - cron: "0 2 * * *"

permissions:
  contents: write

jobs:
  generate:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 11

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - name: Generate activity SVG
        uses: MoDevIO/github-wakatime-activity@main
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          wakatime-token: ${{ secrets.WAKATIME_TOKEN }}
          leetcode-username: ${{ secrets.LEETCODE_USERNAME }}
```

This tool additionally needs your Wakatime API-Key and Leetcode username:
1. Open the repository on GitHub.
2. Go to Settings.
3. Open `Secrets and variables → Actions`.
4. Click `New repository secret`.
5. Add these secrets:

WAKATIME_TOKEN
LEETCODE_USERNAME

You do not need to create GITHUB_TOKEN. GitHub automatically provides it to Actions.
