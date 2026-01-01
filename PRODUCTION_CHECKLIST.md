# Production Release Checklist

This checklist covers all the steps needed to prepare BobaPal for a production release.

## ✅ Code Changes Made

The following development/debug code has been updated for production:

- [x] All `console.log` statements wrapped in `__DEV__` checks
- [x] All `console.error` statements wrapped in `__DEV__` checks
- [x] All `console.warn` statements wrapped in `__DEV__` checks
- [x] Amplify configuration now switches between dev/prod based on `APP_ENV`
- [x] API key logging removed (no longer logs partial keys)
- [x] Unused imports removed

---

## 🔐 AWS Configuration

### Cognito User Pool
- [ ] Review user pool settings in AWS Console
- [ ] Ensure password policies are appropriate for production
- [ ] Verify email verification is enabled
- [ ] Review MFA settings (currently OFF - consider enabling)
- [ ] Check that Google OAuth is properly configured
- [ ] Update callback URLs for production domain

### Cognito Identity Pool
- [ ] Verify IAM roles have minimum required permissions
- [ ] Review unauthenticated role permissions (should be minimal/none)
- [ ] Ensure authenticated role only has access to user's own data

### S3 Storage
- [ ] Verify bucket policies are secure (no public access)
- [ ] Enable S3 bucket versioning for data recovery
- [ ] Configure lifecycle rules for cost optimization
- [ ] Enable server-side encryption (SSE-S3 or SSE-KMS)
- [ ] Set up CloudWatch alarms for unusual activity
- [ ] Review CORS configuration

### API Gateway (if applicable)
- [ ] Enable throttling to prevent abuse
- [ ] Configure API keys if needed
- [ ] Set up usage plans

### CloudWatch
- [ ] Set up log groups with appropriate retention
- [ ] Configure alarms for errors/failures
- [ ] Set up billing alerts

### Production Amplify Configuration
- [ ] Create production Cognito user pool
- [ ] Create production S3 bucket
- [ ] Update `src/amplifyconfiguration.prod.json` with production values:
  ```json
  {
    "aws_project_region": "us-east-2",
    "aws_cognito_identity_pool_id": "YOUR_PROD_IDENTITY_POOL_ID",
    "aws_cognito_region": "us-east-2",
    "aws_user_pools_id": "YOUR_PROD_USER_POOL_ID",
    "aws_user_pools_web_client_id": "YOUR_PROD_CLIENT_ID",
    "oauth": {
      "domain": "YOUR_PROD_DOMAIN.auth.us-east-2.amazoncognito.com",
      "scope": ["phone", "email", "openid", "profile", "aws.cognito.signin.user.admin"],
      "redirectSignIn": "bobapal://",
      "redirectSignOut": "bobapal://",
      "responseType": "code"
    }
  }
  ```

---

## 🔑 Google Cloud Configuration

### OAuth 2.0 Credentials
- [ ] Create production OAuth client ID
- [ ] Configure authorized redirect URIs for production
- [ ] Restrict API key to specific APIs (Places API New)
- [ ] Set up application restrictions (iOS bundle ID, Android package name)
- [ ] Configure OAuth consent screen for production:
  - [ ] Set app name: "BobaPal"
  - [ ] Add app logo
  - [ ] Add privacy policy URL
  - [ ] Add terms of service URL
  - [ ] Submit for verification if requesting sensitive scopes

### Places API (New)
- [ ] Verify "Places API (New)" is enabled (not legacy Places API)
- [ ] Set up API key restrictions:
  - [ ] Application restrictions: iOS apps, Android apps
  - [ ] API restrictions: Places API (New) only
- [ ] Set up billing alerts for usage
- [ ] Consider setting daily quotas to prevent unexpected costs

### Google Cloud Console
- [ ] Enable Cloud Console API
- [ ] Set up billing budget and alerts
- [ ] Review IAM permissions

---

## 📱 Expo / EAS Configuration

### App Configuration (app.json)
- [ ] Update version number
- [ ] Increment iOS `buildNumber`
- [ ] Increment Android `versionCode`
- [ ] Verify bundle identifier: `tech.devrim.bobapal`
- [ ] Verify Android package: `tech.devrim.bobapal`
- [ ] Review all permissions descriptions
- [ ] Add privacy manifest if required by Apple

### EAS Build (eas.json)
- [ ] Configure production build profile
- [ ] Set up EAS Secrets:
  ```bash
  eas secret:create --name EXPO_PUBLIC_GOOGLE_PLACES_API_KEY --scope project
  ```
- [ ] Test production build locally

### EAS Submit
- [ ] Update Apple ID in eas.json
- [ ] Update App Store Connect App ID
- [ ] Update Apple Team ID
- [ ] Add Google Play service account JSON
- [ ] Test submission to TestFlight/Internal Testing

---

## 🍎 Apple App Store

### App Store Connect
- [ ] Create app listing
- [ ] Add app screenshots (6.5", 5.5", iPad if supported)
- [ ] Write app description
- [ ] Add keywords
- [ ] Set app category (Food & Drink)
- [ ] Add support URL
- [ ] Add privacy policy URL
- [ ] Configure app pricing

### Certificates & Provisioning
- [ ] Create Distribution certificate
- [ ] Create App Store provisioning profile
- [ ] Configure push notification certificate (if needed)

### Privacy & Compliance
- [ ] Complete App Privacy questionnaire
- [ ] Declare data usage:
  - [ ] Photos (for drink photos)
  - [ ] Location (for finding boba shops)
  - [ ] User ID (for account)
  - [ ] Email (for sign-in)
- [ ] Age rating questionnaire

---

## 🤖 Google Play Store

### Play Console
- [ ] Create app listing
- [ ] Add feature graphic
- [ ] Add screenshots (phone, tablet if supported)
- [ ] Write app description
- [ ] Set app category (Food & Drink)
- [ ] Add privacy policy URL
- [ ] Complete content rating questionnaire
- [ ] Complete data safety questionnaire

### Signing
- [ ] Create upload key (EAS handles this)
- [ ] Set up Play App Signing
- [ ] Test internal testing release

---

## 🧪 Testing Before Release

### Functional Testing
- [ ] Test Google Sign-In flow
- [ ] Test adding a new drink
- [ ] Test photo upload
- [ ] Test store autocomplete (Places API)
- [ ] Test editing a drink
- [ ] Test deleting a drink
- [ ] Test data sync across devices
- [ ] Test offline functionality
- [ ] Test location permissions

### Performance Testing
- [ ] Test app startup time
- [ ] Test image loading speed
- [ ] Test with slow network
- [ ] Test with large dataset (100+ drinks)

### Security Testing
- [ ] Verify no API keys in logs
- [ ] Verify no sensitive data in console
- [ ] Test with revoked credentials
- [ ] Verify deep links are secure

---

## 📋 Final Steps

### Before Submission
- [ ] Run `npm run validate` (typecheck + lint + test)
- [ ] Run `npm run build:prod` for production build
- [ ] Test production build on real devices
- [ ] Review crash reports from testing
- [ ] Back up all credentials and keys

### After Submission
- [ ] Monitor app reviews
- [ ] Set up crash reporting (Sentry, Firebase Crashlytics)
- [ ] Monitor AWS costs
- [ ] Monitor Google Cloud costs
- [ ] Set up user feedback channel

---

## 🔧 Commands Reference

```bash
# Build for production
npm run build:prod

# Submit to stores
npm run submit:ios
npm run submit:android

# Check for issues
npm run validate

# Update OTA (after store approval)
npm run update:prod
```

---

## 📞 Support Resources

- **Expo Documentation**: https://docs.expo.dev
- **AWS Amplify Documentation**: https://docs.amplify.aws
- **Google Cloud Documentation**: https://cloud.google.com/docs
- **App Store Guidelines**: https://developer.apple.com/app-store/review/guidelines/
- **Play Store Guidelines**: https://developer.android.com/distribute/best-practices/launch/launch-checklist

