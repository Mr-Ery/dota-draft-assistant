# Publish This App Online With GitHub Pages

This guide is written for a non-developer.

راهنما به زبان انگلیسی نوشته شده، ولی هر مرحله توضیح فارسی هم دارد تا دقیق بدانی چه کاری انجام می‌دهی.

## What You Will Get

After finishing this guide, your app will have a public link like:

```text
https://YOUR_USERNAME.github.io/dota-draft-assistant/
```

یعنی برنامه از حالت `localhost` خارج می‌شود و می‌توانی لینک را برای دیگران بفرستی.

## Important Before You Start

This app is currently a static web app.

یعنی برای GitHub Pages لازم نیست backend جدا اجرا شود. فایل‌های اصلی مثل `index.html`, `src/app.js`, `src/styles.css` مستقیم روی GitHub Pages سرو می‌شوند.

Current important files:

```text
index.html
src/app.js
src/styles.css
src/draft-data.js
src/generated/hero-catalog.js
src/services/builds.js
src/services/assets.js
```

## Step 1 - Create a GitHub Account

Go to:

```text
https://github.com
```

Create an account or sign in.

فارسی: اول باید اکانت GitHub داشته باشی. GitHub جایی است که فایل‌های پروژه را آنلاین نگه می‌دارد.

## Step 2 - Create a New Repository

Click:

```text
New repository
```

Use this name:

```text
dota-draft-assistant
```

Recommended settings:

```text
Visibility: Public
Initialize with README: Off
Add .gitignore: None
License: None
```

فارسی: repository یعنی فولدر آنلاین پروژه روی GitHub. اگر public باشد، GitHub Pages راحت‌تر لینک عمومی می‌دهد.

## Step 3 - Upload The Project Files

Open your new GitHub repository.

Click:

```text
uploading an existing file
```

Then drag all project files into GitHub.

Upload the content of this folder:

```text
C:\Users\erfan_1\Documents\Codex\2026-05-08\application-start-flow-required-user-selections
```

Make sure these files/folders are uploaded:

```text
index.html
package.json
manifest.webmanifest
service-worker.js
src/
data/
docs/
scripts/
backend/
api/
```

Then click:

```text
Commit changes
```

فارسی: این مرحله مثل این است که کل پروژه را داخل GitHub کپی می‌کنی.

## Step 4 - Enable GitHub Pages

Inside the repository, click:

```text
Settings
```

Then left sidebar:

```text
Pages
```

Under `Build and deployment`, set:

```text
Source: Deploy from a branch
Branch: main
Folder: /root
```

Click:

```text
Save
```

فارسی: اینجا به GitHub می‌گویی همین فایل‌ها را به عنوان سایت آنلاین منتشر کند.

## Step 5 - Wait For The Link

GitHub may take 1-5 minutes.

بعد از چند دقیقه در همان صفحه Pages یک لینک می‌بینی:

```text
https://YOUR_USERNAME.github.io/dota-draft-assistant/
```

Open it in a browser.

## Step 6 - Test The Online App

Test these:

```text
1. Select Enemy Picks Only
2. Select Position 1 Carry
3. Add enemy heroes
4. Check recommendations
5. Click a recommended hero
6. Check final item build and explanations
```

فارسی: حتما چک کن که روی لینک آنلاین هم مثل localhost کار کند.

## If Images Do Not Update

Browser cache can keep old files.

Try:

```text
Ctrl + F5
```

Or open:

```text
https://YOUR_USERNAME.github.io/dota-draft-assistant/?fresh=1
```

فارسی: اگر هنوز عکس یا متن قدیمی دیدی، احتمالا cache است.

## If The Page Is Blank

Check these:

1. `index.html` must be in the root of the repository.
2. GitHub Pages folder must be `/root`.
3. The repository must be public, unless your GitHub plan supports private Pages.
4. Wait a few minutes and refresh.

فارسی: صفحه blank معمولا یعنی فایل‌ها در فولدر اشتباه آپلود شده‌اند یا Pages هنوز deploy نشده.

## If You Want A Better Production Setup

GitHub Pages is good for a first public link.

For a more professional product, use:

```text
Frontend: Vercel / Netlify / Cloudflare Pages
Backend: Railway / Render / Supabase / AWS
Database: Supabase Postgres
```

فارسی: GitHub Pages برای نسخه اولیه عالی است، ولی برای backend واقعی و دیتای live بهتر است Vercel + Railway یا Supabase استفاده شود.

## Updating The App Later

When you change files:

1. Upload changed files again to GitHub.
2. Click `Commit changes`.
3. Wait for GitHub Pages to update.
4. Refresh the public link.

فارسی: هر بار تغییر دادی، باید فایل‌های جدید را دوباره commit کنی.

## Dotabuff Data Note

The app links each final hero page to Dotabuff:

```text
https://www.dotabuff.com/heroes/HERO-NAME
```

Direct scripted scraping from Dotabuff may return:

```text
403 Forbidden
```

فارسی: یعنی اگر برنامه بخواهد خودکار از Dotabuff دیتا بکشد، ممکن است Dotabuff جلویش را بگیرد. برای محصول واقعی بهتر است data ingestion روی backend و با source مجاز انجام شود.

## Final Checklist

Before sending the link to other people:

- [ ] App opens on desktop.
- [ ] App opens on mobile.
- [ ] Position 1 does not show non-carry heroes.
- [ ] Hero images load.
- [ ] Item icons load.
- [ ] Final hero explanation changes with enemy picks.
- [ ] Dotabuff link opens for selected hero.
- [ ] You added an unofficial disclaimer if publishing publicly.

## Recommended Disclaimer

Add this somewhere later in the app:

```text
Dota 2 and related assets are owned by Valve Corporation.
This is an unofficial draft assistant and is not affiliated with Valve.
```

فارسی: چون از عکس‌ها و اسم‌های Dota استفاده می‌کنی، بهتر است واضح بگویی برنامه رسمی Valve نیست.
