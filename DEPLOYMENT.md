# Buhba - Production Deployment Guide

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [AWS Setup](#aws-setup)
3. [Google Sign-In Setup](#google-sign-in-setup)
4. [App Store Setup (iOS)](#app-store-setup-ios)
5. [Play Store Setup (Android)](#play-store-setup-android)
6. [EAS Build & Submit](#eas-build--submit)
7. [Post-Deployment](#post-deployment)

---

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests pass: `npm test`
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] Linting passes: `npm run lint`
- [ ] No console.log statements in production code
- [ ] Error handling is comprehensive
- [ ] Loading states are implemented

### Configuration
- [ ] Update `app.json`:
  - [ ] Set unique `bundleIdentifier` (iOS) - e.g., `com.yourcompany.buhba`
  - [ ] Set unique `package` (Android) - e.g., `com.yourcompany.buhba`
  - [ ] Update `version` to `1.0.0`
  - [ ] Set `buildNumber` (iOS) and `versionCode` (Android)
  - [ ] Add your EAS project ID
  - [ ] Add your Expo username as `owner`

### Assets
- [ ] App icon (1024x1024px, no alpha channel for iOS)
- [ ] Splash screen
- [ ] Adaptive icon for Android
- [ ] App Store screenshots (various sizes)
- [ ] Play Store screenshots

---

## AWS Setup

### 1. Create Production Amplify Environment

```bash
# Create a new production environment
amplify env add
# Name it: prod

# Push the production environment
amplify push
```

### 2. Configure Cognito User Pool

1. Go to AWS Console → Cognito → User Pools
2. Select your production user pool
3. Under "App integration" → "Domain name":
   - Create a custom domain or use Cognito domain
   - Note the domain for `amplifyconfiguration.prod.json`

### 3. Configure S3 Bucket

1. Go to AWS Console → S3
2. Select your production bucket
3. Ensure CORS is configured:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"]
  }
]
```

### 4. Update Production Config

Edit `src/amplifyconfiguration.prod.json` with your production values:
- `aws_cognito_identity_pool_id`
- `aws_user_pools_id`
- `aws_user_pools_web_client_id`
- `oauth.domain`
- `aws_user_files_s3_bucket`

---

## Google Sign-In Setup

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Google+ API" and "Google Identity"

### 2. Create OAuth 2.0 Credentials

#### For iOS:
1. Go to APIs & Services → Credentials
2. Create OAuth 2.0 Client ID
3. Select "iOS" application type
4. Enter your Bundle ID: `com.yourcompany.buhba`
5. Save the Client ID

#### For Android:
1. Create OAuth 2.0 Client ID
2. Select "Android" application type
3. Enter your Package name: `com.yourcompany.buhba`
4. Get SHA-1 fingerprint:
   ```bash
   # For debug
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   
   # For release (use your upload keystore)
   keytool -list -v -keystore your-upload-key.keystore -alias your-key-alias
   ```
5. Enter the SHA-1 fingerprint
6. Save the Client ID

#### For Web (required for Cognito):
1. Create OAuth 2.0 Client ID
2. Select "Web application"
3. Add Authorized JavaScript origins:
   - `https://your-cognito-domain.auth.us-east-2.amazoncognito.com`
4. Add Authorized redirect URIs:
   - `https://your-cognito-domain.auth.us-east-2.amazoncognito.com/oauth2/idpresponse`
5. Save the Client ID and Client Secret

### 3. Configure Cognito with Google

1. Go to AWS Cognito → User Pools → Your Pool
2. Sign-in experience → Federated identity provider sign-in
3. Add Google as identity provider:
   - Client ID: Your Web OAuth Client ID
   - Client Secret: Your Web OAuth Client Secret
   - Authorized scopes: `profile email openid`
4. Map attributes:
   - `email` → `email`
   - `name` → `name`

### 4. Configure App Client

1. Go to App integration → App clients
2. Edit your app client
3. Under "Hosted UI":
   - Add callback URL: `buhba://`
   - Add sign-out URL: `buhba://`
   - Enable Google as identity provider

---

## App Store Setup (iOS)

### 1. Apple Developer Account

1. Enroll in [Apple Developer Program](https://developer.apple.com/programs/) ($99/year)
2. Accept all agreements in App Store Connect

### 2. Create App in App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. My Apps → + → New App
3. Fill in:
   - Platform: iOS
   - Name: Buhba
   - Primary Language: English
   - Bundle ID: Select your bundle ID
   - SKU: buhba-ios-001

### 3. App Information

Fill in all required fields:
- [ ] App name
- [ ] Subtitle
- [ ] Privacy Policy URL (required!)
- [ ] Category: Food & Drink or Lifestyle
- [ ] Age Rating: 4+ (complete questionnaire)
- [ ] Copyright

### 4. Prepare Screenshots

Required sizes:
- iPhone 6.7" (1290 x 2796 px)
- iPhone 6.5" (1242 x 2688 px)
- iPhone 5.5" (1242 x 2208 px)
- iPad Pro 12.9" (2048 x 2732 px) - if supporting iPad

### 5. App Review Information

- [ ] Contact information
- [ ] Demo account (create a test account)
- [ ] Notes for reviewer

### 6. Create Privacy Policy

Create a privacy policy page that includes:
- Data collected (email, photos, drink information)
- How data is used
- Third-party services (AWS, Google)
- Data retention policy
- User rights (GDPR/CCPA compliance)

Host it at: `https://yourwebsite.com/privacy`

---

## Play Store Setup (Android)

### 1. Google Play Developer Account

1. Register at [Google Play Console](https://play.google.com/console) ($25 one-time)
2. Complete account setup

### 2. Create App

1. All apps → Create app
2. Fill in:
   - App name: Buhba
   - Default language: English
   - App or game: App
   - Free or paid: Free

### 3. Store Listing

Fill in:
- [ ] Short description (80 chars)
- [ ] Full description (4000 chars)
- [ ] App icon (512 x 512 px)
- [ ] Feature graphic (1024 x 500 px)
- [ ] Screenshots (min 2, max 8 per device type)
- [ ] Category: Food & Drink
- [ ] Contact email

### 4. Content Rating

Complete the content rating questionnaire (IARC)

### 5. Data Safety

Declare:
- [ ] Data collected
- [ ] Data shared
- [ ] Security practices
- [ ] Data deletion policy

### 6. Create Service Account for EAS

1. Google Cloud Console → IAM & Admin → Service Accounts
2. Create service account
3. Grant "Service Account User" role
4. Create JSON key
5. In Play Console: Setup → API access → Link service account
6. Grant "Release manager" permission
7. Save JSON as `google-service-account.json` (add to .gitignore!)

---

## EAS Build & Submit

### 1. Install and Login to EAS

```bash
npm install -g eas-cli
eas login
```

### 2. Configure EAS

```bash
eas build:configure
```

Update `eas.json` with your credentials.

### 3. Build for Production

```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production

# Both
eas build --platform all --profile production
```

### 4. Submit to Stores

```bash
# iOS - Submit to App Store
eas submit --platform ios --profile production

# Android - Submit to Play Store
eas submit --platform android --profile production
```

---

## Post-Deployment

### Monitoring

1. **Crash Reporting**: Consider adding Sentry or Bugsnag
   ```bash
   npx expo install @sentry/react-native
   ```

2. **Analytics**: Add analytics to track usage
   ```bash
   npx expo install expo-analytics
   ```

### Updates

For Over-the-Air (OTA) updates:
```bash
eas update --branch production --message "Bug fixes"
```

### Version Bumping

Before each release:
1. Update `version` in `app.json`
2. Increment `buildNumber` (iOS) and `versionCode` (Android)

---

## Security Checklist

- [ ] No hardcoded secrets in code
- [ ] API keys in environment variables
- [ ] SSL/TLS for all API calls
- [ ] Secure storage for sensitive data
- [ ] Input validation on all user inputs
- [ ] Rate limiting on API endpoints
- [ ] Regular security audits

---

## Quick Commands Reference

```bash
# Run tests
npm test

# Type check
npx tsc --noEmit

# Build for development
eas build --profile development

# Build for preview (internal testing)
eas build --profile preview

# Build for production
eas build --profile production

# Submit to stores
eas submit --platform ios
eas submit --platform android

# OTA update
eas update --branch production

# Check build status
eas build:list
```

---

## Troubleshooting

### Google Sign-In Issues
1. Verify OAuth credentials match bundle ID/package name
2. Check Cognito callback URLs match app scheme
3. Ensure Google identity provider is enabled in Cognito

### Build Failures
1. Check EAS build logs: `eas build:view`
2. Verify all native dependencies are compatible
3. Ensure provisioning profiles are valid (iOS)

### App Store Rejection
Common reasons:
- Missing privacy policy
- Incomplete metadata
- Crashes during review
- Guideline violations

---

## Support

- [Expo Documentation](https://docs.expo.dev/)
- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)

