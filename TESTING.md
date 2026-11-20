# Canvas Gantt Custom verification

Reviewed on 2026-11-20. The custom build is based on upstream `b272f91`.

| Check | Result |
| --- | --- |
| TypeScript and Vite production build | Passed. |
| ESLint, translations, and async state contract | Passed. |
| Vitest frontend regression | 2,105 tests passed across 112 files. |
| Chromium with mocked Redmine data | Serial run: 120 passed, one failed (simultaneous multi-tab timer operations), and one intentionally skipped performance measurement. The status filter passed on the serial rerun after a failure in the parallel run. In five targeted repetitions of the timer scenario, upstream and custom each had four passes and one failure at the same assertion. |
| Custom browser scenarios | Passed. Verified exact custom-status RGB pixels in both downloaded PNGs, persisted controls, workload filtering, individual capacity, and removal of actual values. |
| Chromium against Redmine 6.0.12 | Four passed, including workload layout, planned and actual totals, Heatmap, Hide Actual, and reload persistence. |
| Manual checks, VitePress build, and browser smoke | Passed. The documentation smoke suite passed all 16 tests. |
| Tracked build manifests and lockfile provenance | Passed. |

The integration server ran locally on loopback with Ruby 3.1.3, SQLite, upstream Redmine fixtures, and synthetic issues and hours. The temporary Redmine checkout pinned the CGI gem for its Ruby 3.1 runtime. The plugin has no such dependency change. Docker was unavailable. The upstream compatibility targets include Redmine 6.1 and 7.0. This verification exercised Redmine 6.0.12.

The local Ruby regression suite reported 482 examples, 30 failures, and 11 pending. The same SQLite/macOS setup reported 29 of those failures on upstream `b272f91`. Failures involved Redmine fixture category or tracker validation, SQLite write concurrency, and macOS temporary path canonicalization. The unmatched derived-parent issue draft evaluator example passed when rerun on its own.

## Run the checks

From `spa/`, use a Node version supported by both the Vite and test dependencies.

```sh
npm ci
npm run lint
npm run check:i18n-contract
npm run check:async-contract
npm run test -- --run
npm run build
npx playwright install chromium
npm run test:e2e -- --workers=1
```

The build artifact checker validates the committed manifest and its referenced assets. Run `npm run check:build-artifacts` against the packaged commit. Against a disposable Redmine with fixtures, REST enabled and Canvas Gantt enabled for the test project, run:

```sh
REDMINE_BASE_URL=http://127.0.0.1:3037 npm run test:e2e -- \
  -c playwright.redmine.config.ts tests/e2e-redmine/redmine-smoke.pw.ts \
  tests/e2e-redmine/workload-pane.pw.ts --workers=1
```
