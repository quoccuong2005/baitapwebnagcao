# Northstar Catalog

React dashboard demo for managing 10,000 products. The table uses row virtualization and memoized filtering/sorting to keep the UI responsive.

## Run locally

```sh
npm install
npm run dev
```

## Production preview and Lighthouse

```sh
npm run build
npm run preview -- --host=127.0.0.1 --port=4173
```

In another terminal, run `npm run audit:perf`. This writes the Lighthouse JSON report to `lighthouse-after.json`. See [LIGHTHOUSE_REPORT.md](LIGHTHOUSE_REPORT.md) for the before/after comparison and saved baseline report.

## Checks

```sh
npm run lint
npm run build
```
