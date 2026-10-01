# Lighthouse Performance Report

**Project:** Northstar product catalog, 10,000 products  
**Date:** 2026-10-01  
**Method:** Lighthouse CLI 12.8.2, Chrome headless, production preview at `http://localhost:4173/`, Performance category. Each result is one local run; small timing differences can vary between runs.

## Before and after

| Metric | Before | After | Change |
|---|---:|---:|---:|
| Performance score | 49 | 99 | +50 points |
| FCP | 1.3 s | 1.4 s | +0.1 s |
| LCP | 4.1 s | 1.5 s | -2.6 s |
| TBT | 8,931 ms | 90 ms | -8,841 ms |
| CLS | 0.00 | 0.00 | No change |

FCP was effectively similar and measured 0.1 s slower after optimization, within expected run-to-run variation. The large improvements are LCP and especially TBT: the browser no longer has to create and lay out ten thousand table rows at once.

## Changes applied

- **Virtualization:** `@tanstack/react-virtual` renders only visible rows plus overscan. The 10,000-product dataset produced 21 table row elements in the browser check; the scroll container retains the full list height and scroll behavior.
- **Memoization:** `useMemo` caches the filtered and sorted product list until its inputs change; `React.memo` avoids rerendering unchanged rows.
- **Deferred search:** `useDeferredValue` keeps typing responsive while the 10,000-item search is recalculated.

Search, status filtering, and scrolling were exercised in the browser. Searching for `PR-09999` returned one item; the Low stock filter returned 1,344 items while keeping only 21 row elements mounted. A 390px viewport had no page-level horizontal overflow; the table scrolls within its own container.

## Saved artifacts

- Before: [lighthouse-before.report.html](lighthouse-before.report.html)
- After: [lighthouse-after.json](lighthouse-after.json)

## Reproduce

Run `npm run build`, start the production preview on port 4173 with `npm run preview -- --host=127.0.0.1 --port=4173`, then run `npm run audit:perf` in another terminal. The audit script overwrites `lighthouse-after.json`.
