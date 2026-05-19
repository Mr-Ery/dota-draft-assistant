# راهنمای تبدیل برنامه به iOS و انتشار در App Store

این فایل توضیح می‌دهد چطور همین Web App را تبدیل به iOS app کنی و در Apple App Store منتشر کنی.

## مسیر پیشنهادی برای این پروژه

برای این برنامه، بهترین مسیر فعلی:

```text
Web App -> Capacitor -> Xcode iOS Project -> TestFlight -> App Store Review -> App Store
```

چرا Capacitor؟

- همین کد HTML/CSS/JS را داخل یک native wrapper اجرا می‌کند.
- برای MVP سریع‌تر از React Native یا Swift native است.
- بعدا اگر لازم شد، می‌توانی native features اضافه کنی.
- همین ساختار برای Android هم قابل استفاده است.

## پیش‌نیازهای اجباری

برای ساخت و انتشار iOS app تقریبا حتما به این‌ها نیاز داری:

- Mac یا دسترسی به macOS build machine
- Xcode
- Apple Developer Program account
- App Store Connect access
- Bundle ID اختصاصی، مثلا:

```text
com.yourcompany.dotadraftassistant
```

بدون Apple Developer Program نمی‌توانی app را رسمی روی App Store منتشر کنی.

## مرحله 1: مطمئن شو نسخه وب آماده است

قبل از iOS، نسخه web را آماده کن:

- برنامه روی browser درست کار کند.
- responsive باشد.
- online URL داشته باشد یا assets داخل app package کپی شوند.
- تصویر hero/item خراب نباشد.
- modeها درست کار کنند.

در این پروژه فایل‌های PWA هم آماده شده‌اند:

```text
manifest.webmanifest
service-worker.js
capacitor.config.json
```

## مرحله 2: نصب Capacitor

در root پروژه:

```powershell
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios
```

اگر npm روی سیستم فعلی نصب نیست، این مرحله را باید روی دستگاهی انجام دهی که Node.js و npm کامل دارد، ترجیحا Mac.

## مرحله 3: initialize کردن Capacitor

در پروژه:

```powershell
npx cap init
```

اگر پرسید:

```text
App name: Dota Draft Assistant
App ID: com.yourcompany.dotadraftassistant
```

در این پروژه یک فایل اولیه داریم:

```text
capacitor.config.json
```

ولی قبل از publish باید `appId` را واقعی کنی:

```json
{
  "appId": "com.yourcompany.dotadraftassistant",
  "appName": "Dota Draft Assistant",
  "webDir": "."
}
```

`appId` نباید بعدا بی‌دلیل تغییر کند، چون هویت app در App Store است.

## مرحله 4: اضافه کردن iOS platform

```powershell
npx cap add ios
```

بعد sync:

```powershell
npx cap sync ios
```

Capacitor یک فولدر می‌سازد:

```text
ios/
```

## مرحله 5: باز کردن پروژه در Xcode

```powershell
npx cap open ios
```

یا مستقیم:

```text
ios/App/App.xcworkspace
```

در Xcode این موارد را تنظیم کن:

- Team: Apple Developer Team خودت
- Bundle Identifier: همان `com.yourcompany.dotadraftassistant`
- Display Name: `Dota Draft Assistant`
- Version: مثلا `1.0.0`
- Build Number: مثلا `1`
- Signing: بهتر است اول `Automatically manage signing`

## مرحله 6: App Icons و Launch Screen

برای App Store باید app icon درست داشته باشی.

نیاز داری:

- iPhone icon sizes
- iPad icon sizes اگر iPad هم target است
- App Store icon 1024x1024

پیشنهاد:

- از logo مستقل استفاده کن.
- از hero art رسمی Valve به عنوان app icon استفاده نکن، چون ممکن است در review یا trademark مشکل ایجاد کند.

Launch Screen:

- ساده، تاریک، با نام برنامه
- بدون متن زیاد
- سریع load شود

## مرحله 7: Privacy و Permissions

اگر برنامه فقط draft assistant باشد و permission خاصی نخواهد، ساده‌تر است.

ولی اگر بعدا اضافه کنی:

- notifications
- login
- analytics
- camera
- clipboard
- location

باید در `Info.plist` توضیح usage بدهی.

مثلا Apple برای permissionها توضیح انسانی می‌خواهد. اگر permission بدون دلیل روشن باشد، reject محتمل است.

## مرحله 8: App Store Connect app بساز

در [App Store Connect](https://appstoreconnect.apple.com/) برو به:

```text
My Apps -> New App
```

اطلاعات:

```text
Platform: iOS
Name: Dota Draft Assistant
Primary Language: English یا Persian
Bundle ID: همان bundle id که در Xcode داری
SKU: dotadraftassistant-ios-001
User Access: Full Access
```

## مرحله 9: ساخت Archive در Xcode

در Xcode:

1. device target را روی `Any iOS Device` یا Generic Device بگذار.
2. از منو:

```text
Product -> Archive
```

3. بعد از build، Organizer باز می‌شود.
4. گزینه `Distribute App` را بزن.
5. روش:

```text
TestFlight & App Store
```

6. Upload کن به App Store Connect.

طبق راهنمای Apple، buildها را می‌توانی از Xcode، Transporter یا API به App Store Connect upload کنی.

## مرحله 10: TestFlight

قبل از public release، از TestFlight تست بگیر.

کارهایی که باید تست شوند:

- نصب روی iPhone واقعی
- نصب روی iPad اگر پشتیبانی می‌کنی
- سرعت باز شدن app
- نمایش hero portraits
- نمایش item icons
- کارکرد offline/weak network
- صفحه final analysis
- برگشت به draft
- touch targets روی موبایل

Internal testing سریع‌تر است. External testing ممکن است beta review بخواهد.

## مرحله 11: Store Listing

برای App Store باید metadata کامل کنی:

- App name
- Subtitle
- Description
- Keywords
- Support URL
- Marketing URL اختیاری
- Privacy Policy URL
- Screenshots
- App category
- Age rating
- Content rights
- Privacy Nutrition Labels

برای این app پیشنهاد description:

```text
Dota Draft Assistant helps players evaluate enemy picks, team synergy, timing windows, counters, and role-specific hero recommendations during live drafts.
```

اگر از Dota assets استفاده می‌کنی، باید مراقب باشی app طوری معرفی نشود که official Valve product به نظر برسد.

## مرحله 12: Privacy Policy

حتی اگر دیتا جمع نمی‌کنی، بهتر است Privacy Policy داشته باشی.

حداقل بگو:

- آیا account ساخته می‌شود یا نه
- آیا analytics داری یا نه
- آیا personal data ذخیره می‌شود یا نه
- آیا third-party services استفاده می‌شوند یا نه
- contact email

اگر در آینده backend و analytics اضافه شود، باید policy را update کنی.

## مرحله 13: Submit for Review

در App Store Connect:

1. app را باز کن.
2. version را انتخاب کن.
3. build upload شده را انتخاب کن.
4. metadata را کامل کن.
5. screenshots را اضافه کن.
6. روی `Add for Review` بزن.
7. بعد `Submit for Review`.

طبق مستندات Apple، submission اول `Ready for Review` می‌شود و بعد با `Submit for Review` وارد review می‌شود.

## دلایل رایج reject برای این پروژه

این‌ها را جدی بگیر:

1. **Trademark / IP**
   - نگو official Dota یا official Valve.
   - از اسم و لوگوی Dota 2 در app icon به شکل گمراه‌کننده استفاده نکن.

2. **App too web-like**
   - Apple گاهی appهایی که فقط website wrapper هستند را سخت‌گیرانه بررسی می‌کند.
   - باید تجربه موبایل خوب باشد: navigation، touch، performance، offline behavior.

3. **Broken images**
   - اگر hero/item assets load نشوند، reject یا تجربه بد می‌شود.

4. **No privacy policy**
   - مخصوصا اگر network/backend/analytics داری.

5. **Misleading data**
   - اگر می‌گویی Patch 7.41c، باید مشخص باشد دیتا چه زمانی update شده.

## پیشنهاد برای نسخه 1.0 iOS

برای اینکه شانس review بهتر شود:

- یک About/Disclaimer page اضافه کن.
- یک Privacy Policy URL آماده کن.
- app icon اختصاصی بساز.
- screenshots واقعی از iPhone تهیه کن.
- offline fallback داشته باش.
- متن "unofficial" را واضح بگذار.

## ساختار آینده برای iOS

بعدا می‌توانی این‌ها را اضافه کنی:

- login
- saved drafts
- favorite heroes
- live patch updates
- push notification برای patch changes
- backend sync
- subscription یا premium features

ولی برای نسخه اول، پیشنهاد من ساده نگه‌داشتن است:

```text
Live Draft -> Recommendation -> Final Hero Analysis -> Item Build
```

## منابع رسمی

- Capacitor iOS: [https://capacitorjs.com/docs/ios](https://capacitorjs.com/docs/ios)
- Capacitor main docs: [https://capacitorjs.com/docs](https://capacitorjs.com/docs)
- Apple App Store Connect workflow: [https://developer.apple.com/help/app-store-connect/get-started/app-store-connect-workflow](https://developer.apple.com/help/app-store-connect/get-started/app-store-connect-workflow)
- Apple upload builds: [https://developer.apple.com/help/app-store-connect/manage-builds/upload-builds/](https://developer.apple.com/help/app-store-connect/manage-builds/upload-builds/)
- Apple submit app: [https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-app/](https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-app/)
- Apple distribution with Xcode: [https://developer.apple.com/documentation/xcode/distributing-your-app-for-beta-testing-and-releases/](https://developer.apple.com/documentation/xcode/distributing-your-app-for-beta-testing-and-releases/)
