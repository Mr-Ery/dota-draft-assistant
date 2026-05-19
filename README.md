# Dota 2 Draft Assistant

Standalone live drafting assistant for Patch 7.41c.

## Start

```powershell
node scripts\static-server.mjs
```

Open `http://127.0.0.1:4173`.

## API

```powershell
node backend\server.mjs
```

The backend exposes `POST /api/recommendations` and `POST /api/final`.

See `docs/architecture.md` for online deployment and mobile-ready module boundaries.

For public web deployment and iOS/Android conversion notes, see `docs/deploy-online.md`.

Detailed Persian guides:

- `docs/01-online-deployment-fa.md`
- `docs/02-ios-app-store-fa.md`
- `docs/03-android-google-play-fa.md`
- `docs/github-pages-non-developer-guide.md`

## Flow

1. Choose the draft analysis philosophy.
2. Choose the user's role.
3. Add enemy or ally picks. Recommendations recalculate immediately after every pick.

## Counter Database

The app ships with a structured Patch 7.41c seed dataset in `src/draft-data.js`.

The Dotabuff ingester is in `scripts/dotabuff-ingest.mjs` and writes to `data/dotabuff-counters-7.41c.json`.

The full hero database ingester is in `scripts/full-hero-database-ingest.mjs` and writes to `data/hero-database-7.41c.json`.

After generating that database, regenerate the browser hero catalog:

```powershell
node scripts\generate-hero-catalog.mjs
```

```powershell
node scripts\dotabuff-ingest.mjs
node scripts\full-hero-database-ingest.mjs
node scripts\generate-hero-catalog.mjs
```

Dotabuff may return `403 Forbidden` to direct scripted requests. When that happens, the ingester records the blocked page with an `error` field instead of stopping the whole run.
