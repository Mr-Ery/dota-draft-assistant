# Online Deployment

The app no longer needs to stay local. It can be hosted as a static web app, with the recommendation backend deployed separately when live scraped data is added.

## Fastest Web Deploy

### Vercel

1. Push this folder to a GitHub repository.
2. Import the repository in Vercel.
3. Framework preset: `Other`.
4. Build command: leave empty.
5. Output directory: `.`.
6. Deploy.

### Netlify

1. Push this folder to a GitHub repository.
2. Import the repository in Netlify.
3. Build command: leave empty.
4. Publish directory: `.`.
5. Deploy.

### Cloudflare Pages

1. Push this folder to a GitHub repository.
2. Create a Pages project.
3. Build command: leave empty.
4. Output directory: `/`.
5. Deploy.

## Backend Deploy

Deploy `backend/server.mjs` to Railway, Render, AWS, DigitalOcean, or another Node host.

Set the backend command to:

```powershell
node backend/server.mjs
```

The service exposes:

- `POST /api/recommendations`
- `POST /api/final`

## iOS / Android Path

The current app is now PWA-ready through:

- `manifest.webmanifest`
- `service-worker.js`

For native apps, use Capacitor first because it can wrap this web app with the fewest changes:

```powershell
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add ios
npx cap add android
npx cap sync
```

Later, the shared recommendation engine can move unchanged into:

- React Native
- Flutter via API calls
- a native mobile backend
