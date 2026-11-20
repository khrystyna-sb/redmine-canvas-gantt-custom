# Changelog

## 0.20.0-custom.1 — 2026-11-20

Based on Canvas Gantt upstream commit `b272f91`. The repository retains upstream Git history.

- Added **Color by Status** with a customizable legend and shared rendering for both PNG exports. Commit `54752ee`.
- Added the **Workload Heatmap** and daily capacity overrides per assignee. Commit `c495c3c`.
- Added **Show Actual / Hide Actual**. Planned workload is recalculated through the existing pipeline, and hidden time entries are excluded from display and requests. Commit `91a7dbc`.
- Added Chromium regression scenarios for PNG pixel colors, reload persistence, workload filtering, and different capacities.
