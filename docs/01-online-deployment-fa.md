# راهنمای آنلاین کردن برنامه وب Dota Draft Assistant

این فایل توضیح می‌دهد چطور برنامه را از حالت `localhost` خارج کنی و یک لینک عمومی بسازی که بتوانی برای بقیه بفرستی.

## وضعیت فعلی برنامه

برنامه فعلی یک Web App است:

- فایل اصلی: `index.html`
- کد اصلی UI: `src/app.js`
- استایل: `src/styles.css`
- موتور پیشنهاددهی: `src/engine/recommendation-engine.js`
- دیتای فعلی: `src/draft-data.js`
- آماده برای PWA: `manifest.webmanifest` و `service-worker.js`

یعنی برای آنلاین شدن، لازم نیست حتما سرور سنگین داشته باشی. می‌توانی اول نسخه وب را روی Vercel، Netlify یا Cloudflare Pages بگذاری.

## انتخاب پیشنهادی من

برای شروع سریع:

1. **Vercel** اگر می‌خواهی ساده‌ترین مسیر با GitHub داشته باشی.
2. **Netlify** اگر می‌خواهی Drag & Drop یا Git Deploy راحت داشته باشی.
3. **Cloudflare Pages** اگر بعدا performance/CDN خیلی مهم شد.

برای این پروژه، من پیشنهاد می‌کنم اول با **Vercel** بروی جلو.

## پیش‌نیازها

باید این‌ها را داشته باشی:

- یک حساب GitHub
- یک حساب Vercel یا Netlify
- فایل‌های پروژه همین فولدر
- یک اسم برای پروژه، مثلا `dota-draft-assistant`

اگر backend واقعی برای scraping/data داشته باشی، بعدا باید یک host جدا مثل Railway یا Render هم اضافه شود. ولی نسخه فعلی با دیتای داخل پروژه می‌تواند static deploy شود.

## روش 1: آنلاین کردن با Vercel

### مرحله 1: پروژه را روی GitHub بگذار

یک repository جدید بساز:

```text
dota-draft-assistant
```

بعد فایل‌های پروژه را داخلش upload کن.

اگر Git روی سیستم نصب داری:

```powershell
git init
git add .
git commit -m "Initial Dota draft assistant"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/dota-draft-assistant.git
git push -u origin main
```

اگر Git نداری، از خود سایت GitHub هم می‌توانی فایل‌ها را Upload کنی.

### مرحله 2: پروژه را در Vercel Import کن

1. برو به [Vercel](https://vercel.com/).
2. وارد حساب شو.
3. روی `Add New Project` کلیک کن.
4. Repository پروژه را انتخاب کن.
5. تنظیمات را اینطور بگذار:

```text
Framework Preset: Other
Build Command: خالی
Output Directory: .
Install Command: خالی
```

چون این پروژه فعلا static است، build command لازم ندارد.

### مرحله 3: Deploy

روی `Deploy` بزن.

بعد از چند ثانیه Vercel یک لینک می‌دهد، مثلا:

```text
https://dota-draft-assistant.vercel.app
```

این لینک را می‌توانی برای بقیه بفرستی.

### مرحله 4: تست بعد از Deploy

لینک عمومی را باز کن و این‌ها را چک کن:

- صفحه انتخاب Draft Philosophy باز شود.
- حالت `Enemy Picks Only` ally section نداشته باشد.
- حالت `Full Team Draft Analysis` ally section داشته باشد.
- hero images لود شوند.
- item icons در صفحه final درست دیده شوند.
- روی موبایل layout خراب نشود.

## روش 2: آنلاین کردن با Netlify

### حالت ساده: Drag & Drop

1. برو به [Netlify](https://www.netlify.com/).
2. وارد حساب شو.
3. گزینه deploy دستی یا drag-and-drop را پیدا کن.
4. کل فولدر پروژه را upload کن.

ولی این روش برای کار جدی پیشنهاد نمی‌شود، چون هر بار تغییر بدهی باید دستی upload کنی.

### حالت بهتر: Deploy با GitHub

1. پروژه را روی GitHub بگذار.
2. در Netlify گزینه `Add new site` را بزن.
3. `Import an existing project` را انتخاب کن.
4. GitHub repo را وصل کن.
5. تنظیمات:

```text
Build command: خالی
Publish directory: .
```

بعد deploy کن.

Netlify یک لینک شبیه این می‌دهد:

```text
https://dota-draft-assistant.netlify.app
```

## روش 3: آنلاین کردن با Cloudflare Pages

1. وارد Cloudflare شو.
2. برو به `Workers & Pages`.
3. `Create application` یا `Pages` را انتخاب کن.
4. GitHub repo را وصل کن.
5. تنظیمات:

```text
Build command: خالی
Output directory: /
```

بعد deploy کن.

## اگر backend هم بخواهی

الان پروژه یک backend ساده دارد:

```text
backend/server.mjs
```

برای اجرای local:

```powershell
node backend/server.mjs
```

APIها:

```text
POST /api/recommendations
POST /api/final
```

برای production backend، گزینه‌های خوب:

- Railway
- Render
- DigitalOcean App Platform
- AWS
- Supabase Edge Functions

مسیر پیشنهادی:

1. Frontend روی Vercel یا Netlify.
2. Backend روی Railway یا Render.
3. در frontend یک متغیر مثل `API_BASE_URL` تعریف شود.
4. پیشنهادها به جای engine داخل browser، از API خوانده شوند.

## ساختار پیشنهادی production

```text
User Browser / Mobile App
        |
        v
Frontend: Vercel / Netlify / Cloudflare Pages
        |
        v
Backend API: Railway / Render / AWS
        |
        v
Database: Supabase / Postgres
        |
        v
Scraping Jobs: Dotabuff / OpenDota / Dota2ProTracker ingestion
```

## نکته مهم درباره Dotabuff

در تست local، Dotabuff به scraping مستقیم جواب `403 Forbidden` داد. یعنی برای production باید یکی از این مسیرها را انتخاب کنی:

- استفاده از APIهای مجاز مثل OpenDota برای بخش داده‌های عمومی
- ذخیره دیتای ساختاریافته دستی/نیمه‌خودکار
- اجرای ingestion با رعایت قوانین سایت‌ها
- استفاده از دیتای public مجاز

نباید app هر بار از browser کاربر برود Dotabuff را scrape کند. این کار کند، ناپایدار، و از نظر policy پرریسک است.

## دامنه اختصاصی

بعد از deploy می‌توانی دامنه وصل کنی:

```text
dotadraftassistant.com
draft.yourdomain.com
```

در Vercel/Netlify:

1. وارد Project Settings شو.
2. بخش Domains را باز کن.
3. دامنه را اضافه کن.
4. DNS recordهایی که می‌دهد را در پنل دامنه تنظیم کن.

## چک‌لیست قبل از ارسال لینک عمومی

- [ ] لینک روی موبایل باز شود.
- [ ] عکس heroها لود شوند.
- [ ] item icons درست نمایش داده شوند.
- [ ] service worker باعث cache نسخه قدیمی نشود.
- [ ] متن‌ها روی صفحه کوچک overlap نکنند.
- [ ] صفحه final analysis باز شود.
- [ ] modeها درست کار کنند.
- [ ] اگر از Dota 2 assets استفاده می‌کنی، صفحه Terms/Disclaimer داشته باشی.

## پیشنهاد برای Disclaimer

چون برنامه از Dota 2 assets استفاده می‌کند، بهتر است یک متن کوچک در footer یا صفحه About اضافه شود:

```text
Dota 2 and related hero/item imagery are trademarks or assets of Valve Corporation.
This assistant is an unofficial fan/tool project and is not affiliated with Valve.
```

## منابع رسمی

- Vercel Deploy CLI: [https://vercel.com/docs/cli/deploy](https://vercel.com/docs/cli/deploy)
- Netlify Deploy Docs: [https://docs.netlify.com/site-deploys/create-deploys/](https://docs.netlify.com/site-deploys/create-deploys/)
- Netlify Deploy Overview: [https://docs.netlify.com/deploy/deploy-overview/](https://docs.netlify.com/deploy/deploy-overview/)
- Capacitor Docs: [https://capacitorjs.com/docs](https://capacitorjs.com/docs)
