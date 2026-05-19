# راهنمای تبدیل برنامه به Android و انتشار در Google Play

این فایل توضیح می‌دهد چطور همین برنامه را تبدیل به Android app کنی و در Google Play منتشر کنی.

وقتی گفتی «اندروید بگذارم اپ استور»، در Android اسم رسمی فروشگاه معمولا **Google Play Store** است.

## مسیر پیشنهادی برای این پروژه

برای این برنامه:

```text
Web App -> Capacitor -> Android Studio Project -> AAB -> Play Console -> Google Play
```

فرمت اصلی انتشار روی Google Play معمولا:

```text
AAB = Android App Bundle
```

نه APK معمولی.

## پیش‌نیازها

باید داشته باشی:

- Node.js و npm
- Android Studio
- Android SDK
- Java/JDK مناسب Android Studio
- Google Play Developer Account
- یک package name ثابت، مثلا:

```text
com.yourcompany.dotadraftassistant
```

Package name مثل هویت app است. بعد از انتشار نباید راحت تغییر کند.

## مرحله 1: آماده‌سازی Web App

قبل از Android:

- نسخه web باید درست کار کند.
- صفحه روی mobile responsive باشد.
- عکس heroها و itemها درست load شوند.
- final analysis screen با touch خوب کار کند.
- اگر backend داری، HTTPS public URL داشته باشد.

Android WebView از app محتوای web را اجرا می‌کند، پس هر مشکل mobile در web، داخل Android هم دیده می‌شود.

## مرحله 2: نصب Capacitor

در root پروژه:

```powershell
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
```

اگر npm روی سیستم فعلی نیست، روی سیستمی انجام بده که Node.js کامل دارد.

## مرحله 3: تنظیم Capacitor

فایل فعلی:

```text
capacitor.config.json
```

قبل از انتشار، `appId` را واقعی کن:

```json
{
  "appId": "com.yourcompany.dotadraftassistant",
  "appName": "Dota Draft Assistant",
  "webDir": ".",
  "server": {
    "androidScheme": "https"
  }
}
```

اگر با `npx cap init` خواست بسازد:

```powershell
npx cap init
```

App name:

```text
Dota Draft Assistant
```

App ID:

```text
com.yourcompany.dotadraftassistant
```

## مرحله 4: اضافه کردن Android platform

```powershell
npx cap add android
```

بعد sync:

```powershell
npx cap sync android
```

یک فولدر ساخته می‌شود:

```text
android/
```

## مرحله 5: باز کردن در Android Studio

```powershell
npx cap open android
```

یا Android Studio را باز کن و فولدر `android/` را import کن.

## مرحله 6: تست روی Emulator یا گوشی واقعی

از Android Studio:

1. یک emulator بساز.
2. app را Run کن.
3. تست کن:

- startup flow
- hero selection
- enemy-only mode
- full-team mode
- final analysis
- item icons
- back navigation
- screen rotation اگر فعال است
- performance روی گوشی متوسط

طبق docs جدید Capacitor، Android با Android Studio مدیریت می‌شود و platform با `npx cap add android` اضافه می‌شود.

## مرحله 7: App Icon و Splash Screen

برای Google Play باید icon حرفه‌ای داشته باشی.

نکته مهم:

- از لوگوی رسمی Dota 2 یا hero face به عنوان app icon استفاده نکن مگر از نظر حقوقی مطمئن باشی.
- icon اختصاصی بساز که حس Dota داشته باشد ولی official Valve به نظر نرسد.

در Android Studio:

```text
app -> res -> mipmap
```

یا از ابزار:

```text
Image Asset Studio
```

استفاده کن.

## مرحله 8: Permissions

اگر app فقط draft assistant باشد، permission خاصی لازم ندارد.

اگر بعدا اضافه شود:

- internet
- notifications
- storage
- billing
- analytics

باید `AndroidManifest.xml` و privacy policy هماهنگ باشند.

برای این app، معمولا permission اصلی:

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

Capacitor معمولا این را مدیریت می‌کند، ولی قبل از release چک کن.

## مرحله 9: ساخت Release Build

Google Play معمولا AAB می‌خواهد.

در Android Studio:

```text
Build -> Generate Signed Bundle / APK
```

بعد:

```text
Android App Bundle
```

را انتخاب کن.

## مرحله 10: Keystore و Signing

Android app باید sign شود.

طبق Android Developers، برای انتشار با App Bundles باید app bundle را با upload key امضا کنی و Play App Signing بقیه مسیر را مدیریت می‌کند.

در Android Studio:

1. `Generate Signed Bundle / APK`
2. `Android App Bundle`
3. اگر keystore نداری، `Create new`
4. این اطلاعات را امن نگه دار:

```text
Keystore file
Keystore password
Key alias
Key password
```

خیلی مهم:

اگر keystore/upload key را گم کنی، update دادن app سخت یا دردسرساز می‌شود.

## مرحله 11: خروجی AAB

معمولا فایل release اینجا ساخته می‌شود:

```text
android/app/build/outputs/bundle/release/app-release.aab
```

این فایل را در Play Console upload می‌کنی.

## مرحله 12: ساخت app در Google Play Console

در [Google Play Console](https://play.google.com/console/) برو به:

```text
Create app
```

طبق راهنمای رسمی Google باید این‌ها را مشخص کنی:

- default language
- app name
- app یا game بودن
- free یا paid بودن
- contact email
- policy declarations
- Play App Signing terms

برای این پروژه:

```text
Type: App
Free/Paid: احتمالا Free برای نسخه اول
Category: Tools یا Entertainment/Sports بسته به positioning
```

## مرحله 13: Store Listing

باید کامل کنی:

- App name
- Short description
- Full description
- App icon
- Feature graphic
- Screenshots
- Phone screenshots
- Tablet screenshots اگر tablet support داری
- Contact email
- Privacy Policy URL

محدودیت‌های Google طبق docs:

- App name: 30 character limit
- Short description: 80 character limit
- Full description: 4000 character limit

نمونه short description:

```text
Live Dota 2 drafting assistant
```

نمونه full description:

```text
Dota Draft Assistant helps players make role-specific hero choices during live Dota 2 drafts. Analyze enemy picks, team synergy, counters, timing windows, item builds, and final hero recommendations.

This is an unofficial companion tool and is not affiliated with Valve.
```

## مرحله 14: Privacy Policy

برای Play Store هم بهتر است Privacy Policy داشته باشی، مخصوصا اگر:

- internet access داری
- backend داری
- analytics داری
- crash reporting داری
- user data ذخیره می‌کنی

اگر دیتا جمع نمی‌کنی، واضح بنویس.

## مرحله 15: Data Safety

در Play Console باید بخش Data Safety را پر کنی.

باید مشخص کنی:

- چه دیتایی جمع می‌کنی
- آیا دیتا share می‌شود
- آیا encrypted in transit است
- آیا user می‌تواند data deletion request بدهد

اگر نسخه اول هیچ user data ذخیره نمی‌کند، این را دقیق و صادقانه ثبت کن.

## مرحله 16: Testing Requirements

Google برای بعضی developer accountهای جدید، مخصوصا personal accountهای ساخته‌شده بعد از تاریخ‌های جدید، testing requirement دارد.

ممکن است لازم باشد:

- closed testing track بسازی
- تعداد مشخصی tester اضافه کنی
- app مدتی در testing بماند

این مورد را در dashboard خود Play Console می‌بینی.

## مرحله 17: Upload و Release

در Play Console:

1. App را باز کن.
2. برو به `Production` یا اول `Closed testing`.
3. `Create new release`.
4. فایل `.aab` را upload کن.
5. release notes بنویس.
6. review کن.
7. rollout را submit کن.

برای نسخه اول پیشنهاد:

```text
Closed Testing -> Open Testing -> Production
```

نه مستقیم Production.

## دلایل رایج reject یا مشکل در Google Play

1. **استفاده گمراه‌کننده از برند Dota 2**
   - app را official معرفی نکن.
   - icon رسمی Valve/Dota استفاده نکن.

2. **Privacy/Data Safety اشتباه**
   - اگر می‌گویی data جمع نمی‌کنی، واقعا analytics/backend data جمع نکند.

3. **Broken functionality**
   - عکس‌ها نباید خراب باشند.
   - صفحه‌ها نباید blank شوند.

4. **Poor mobile UX**
   - buttonها باید قابل لمس باشند.
   - متن‌ها نباید overlap کنند.

5. **Missing test access**
   - اگر login اضافه کردی، باید test account بدهی.

## نسخه پیشنهادی 1.0 Android

برای انتشار اول:

- بدون login
- بدون payment
- بدون notification
- فقط draft assistant
- final hero analysis
- item build
- offline seed data
- disclaimer واضح

این کار review را ساده‌تر می‌کند.

## مسیر آینده Android

بعدا می‌توانی اضافه کنی:

- backend live patch data
- user saved drafts
- cloud sync
- push notifications برای patch updates
- premium recommendations
- Google Play Billing

ولی برای نسخه اول، کم‌ریسک‌ترین مسیر:

```text
Core draft assistant + polished mobile UX + no complex permissions
```

## منابع رسمی

- Capacitor Android: [https://capacitorjs.com/docs/android](https://capacitorjs.com/docs/android)
- Capacitor main docs: [https://capacitorjs.com/docs](https://capacitorjs.com/docs)
- Android app signing: [https://developer.android.com/guide/publishing/app-signing.html](https://developer.android.com/guide/publishing/app-signing.html)
- Google Play create app: [https://support.google.com/googleplay/android-developer/answer/9859152](https://support.google.com/googleplay/android-developer/answer/9859152)
