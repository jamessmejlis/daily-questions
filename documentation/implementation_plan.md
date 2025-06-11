# Implementation plan

## Phase 1: Environment Setup

1.  Prevalidation: Check if current directory is already an Expo project by looking for `app.json` or `package.json`. If found, abort initialization (**Project Summary: Tech Stack**).
2.  Install Node.js v20.2.1 if not present (**Project Summary: Tech Stack**). Validation: `node -v | grep 20.2.1`.
3.  Install Yarn v1.22.19 globally: `npm install -g yarn@1.22.19` (**Project Summary: Tech Stack**). Validation: `yarn -v`.
4.  Install Expo CLI v6.0.0 globally: `npm install -g expo-cli@6.0.0` (**Project Summary: Tech Stack**). Validation: `expo --version | grep 6.0.0`.
5.  Install Bolt CLI v2.3.4 globally: `npm install -g @bolt/cli@2.3.4` (**Project Summary: Tools**). Validation: `bolt --version | grep 2.3.4`.
6.  Initialize Git repository: `git init` and create GitHub repo named `daily-questions-coach` (**Project Summary: Version Control**).
7.  Scaffold Expo TypeScript project via Bolt: `bolt create expo-typescript daily-questions-coach --template expo-template-blank-typescript` (**Project Summary: Tools**). Validation: confirm `/daily-questions-coach/app.json` exists.
8.  Create `cursor_metrics.md` in project root and refer to `cursor_project_rules.mdc` for usage (**Project Summary: Tools**).
9.  Create `.cursor` directory: `mkdir .cursor` and commit an empty `.cursor/readme.md` to track it (**Project Summary: Tools**).
10. Install project dependencies: run `cd daily-questions-coach && yarn install` (**Project Summary: Tools**).

## Phase 2: Frontend Development

1.  Set up React Navigation v6: `yarn add @react-navigation/native@6.1.6 react-native-screens@3.20.0 react-native-safe-area-context@4.5.0` and `yarn add @react-navigation/native-stack@6.9.12` (**Project Summary: Tech Stack**). Validation: import `NavigationContainer` in `/src/navigation/AppNavigator.tsx`.
2.  Create `/src/navigation/AppNavigator.tsx` with a stack navigator including: Onboarding, Auth, Dashboard, Questions, Calendar, Settings (**Project Summary: App Flow**).
3.  Create `/src/screens/Onboarding.tsx` with introductory explanation and sample questions UI (**Project Summary: Core Features**). Validation: `expo start` and verify Onboarding screen.
4.  Integrate Google Sign-In and Apple Sign-In via Expo AuthSession: `yarn add expo-auth-session@4.3.0 expo-google-app-auth@8.1.1 expo-apple-authentication@4.0.3` (**Project Summary: Core Features**).
5.  Create `/src/screens/Auth.tsx` implementing Google & Apple OAuth and email/password fields storing credentials securely (no backend) using `react-native-encrypted-storage@4.0.2` (**Project Summary: Core Features**). Validation: register new user and confirm entry in EncryptedStorage.
6.  Design `/src/screens/QuestionList.tsx` to add/edit/archive/delete questions (max 20) with format toggle (yes/no, numeric, text) using React Native components (**Project Summary: Core Features**). Validation: add 3 questions and verify persistence.
7.  Create local SQLite schema in `/src/db/schema.ts` defining tables: `questions(id, text, type, archived)`, `answers(id, question_id, date, value)`, `settings(id, notificationsEnabled, notificationTime)` using `expo-sqlite@11.1.0` (**Project Summary: Tech Stack**). Validation: run migration on app start and confirm tables exist.
8.  Develop `/src/screens/Dashboard.tsx` displaying today’s active questions. Implement toggle inputs, numeric/text inputs per question type and a “Save” button (**Project Summary: Core Features**). Validation: complete today’s answers and view saved records in SQLite.
9.  Implement `/src/screens/Calendar.tsx` using `react-native-calendars@1.1281.0` to visualize past answers and streaks. Calculate current and longest streak in-memory (**Project Summary: Core Features**). Validation: populate sample data and verify calendar heatmap and streak counters.
10. Build `/src/screens/Settings.tsx` for notification time picker, account deletion (wipes local DB), and placeholder CSV export button (**Project Summary: Core Features**). Validation: delete account and confirm DB tables are cleared.
11. Install OneSignal SDK: `yarn add react-native-onesignal@4.6.1` and configure App ID in `/app.json` under `expo.plugins` (**Project Summary: Tech Stack**). Validation: initialize OneSignal in `/src/services/notifications.ts` and call `OneSignal.setAppId()`.
12. Schedule daily push notifications via OneSignal: in `/src/services/notifications.ts`, export `scheduleDailyReminder(time: string)` that uses `OneSignal.sendTag` and triggers local notification if offline (**Project Summary: Core Features**). Validation: run on-device test and confirm notification at set time.
13. Integrate Firebase Analytics v9: `yarn add @react-native-firebase/app@15.5.0 @react-native-firebase/analytics@15.5.0` and add `google-services.json` and `GoogleService-Info.plist` to respective platform folders (**Project Summary: Tech Stack**). Validation: call `analytics().logEvent('onboarding_complete')` in Onboarding screen and confirm event in Firebase console.
14. Implement AES-256 encryption for SQLite database using `react-native-sqlcipher-storage@5.0.4`. Modify `/src/db/schema.ts` to open encrypted DB with user’s password (**Project Summary: Non-Functional Requirements – Security**). Validation: inspect DB file on device and verify it’s encrypted.
15. Apply WCAG AA–compliant color palette and large touch targets: define constants in `/src/theme/colors.ts` and reference in all components (**Project Summary: Non-Functional Requirements – Usability**). Validation: run accessibility audit in Expo DevTools.

## Phase 3: Local Database & Offline Support

1.  Build DB access layer in `/src/db/index.ts`: export `getQuestions()`, `saveAnswer()`, `deleteQuestion()` with offline queue support (store pending writes in local DB) (**Project Summary: Non-Functional Requirements – Offline Support**). Validation: simulate offline, perform actions, then reconnect and flush queue.
2.  Write unit tests in `/__tests__/db.test.ts` for all DB functions using Jest and `expo-sqlite` mock (**Project Summary: Tech Stack**). Validation: `yarn test` passes.

## Phase 4: Integration & Testing

1.  Connect screens to DB layer: import and use `getQuestions()` in QuestionList and Dashboard (**Project Summary: App Flow**). Validation: end-to-end scenario: add question → answer → calendar shows entry.
2.  Add error boundaries in `/src/components/ErrorBoundary.tsx` to catch UI exceptions (**Project Summary: Non-Functional Requirements – Performance**). Validation: throw error in child component and confirm fallback UI.
3.  Set up E2E tests with Detox v19.12.0: install `yarn add detox@19.12.0` and create `e2e/firstTest.spec.js` covering onboarding to daily answer flow (**Project Summary: Tools**). Validation: `detox test` passes on iOS simulator.
4.  Configure CI pipeline in GitHub Actions: `/github/workflows/ci.yml` runs `yarn lint`, `yarn test`, `detox test` on push to `main` (**Project Summary: Version Control**). Validation: GitHub Actions green badge.

## Phase 5: Deployment

1.  Configure Expo EAS Build: add `/eas.json` specifying builds for iOS (bundleIdentifier `com.yourcompany.dailyquestions`) and Android (applicationId `com.yourcompany.dailyquestions`) using resource class `default` in `us-east-1` (**Project Summary: Deployment**). Validation: run `eas build --platform all --profile production`.
2.  Publish to TestFlight: after iOS build succeeds, run `eas submit --platform ios --apple-team-id <TEAM_ID>` (**Project Summary: Deployment**). Validation: TestFlight build appears.
3.  Publish Android APK to internal track: `eas submit --platform android --service-account-key-path ./android-service-key.json` (**Project Summary: Deployment**). Validation: build shows in Google Play Console internal testing.
4.  Create `README.md` with installation, development, testing, and deployment instructions, referencing Node.js v20.2.1 and Yarn v1.22.19 (**Project Summary: Version Control**).
5.  Tag v1.0.0 release: `git tag -a v1.0.0 -m "MVP release" && git push origin v1.0.0` (**Project Summary: Success Metrics**).

## Phase 6: Monitoring & Metrics

1.  In Firebase Analytics, configure dashboards for DAU, WAU, streak_7day, onboarding_completion (**Project Summary: Success Metrics**).
2.  In OneSignal, enable delivery success rate monitoring with alert threshold ≥95% (**Project Summary: Success Metrics**).
3.  Add crash reporting via Sentry: `yarn add @sentry/react-native@4.5.0` and initialize in `/src/index.tsx` (**Project Summary: Non-Functional Requirements – Performance**). Validation: force a crash and check Sentry dashboard.

## Phase 7: Final Pre-Launch Checks

1.  Run accessibility audit for WCAG AA compliance on all screens using React Native Accessibility Inspector (**Project Summary: Non-Functional Requirements – Usability**).
2.  Conduct performance profiling in Expo DevTools, ensure cold start <2s and screen transitions <100ms (**Project Summary: Non-Functional Requirements – Performance**).
3.  Validate AES-256 encryption by inspecting storage files manually on device (**Project Summary: Non-Functional Requirements – Security**).
4.  Perform offline/online transition test suite: disable network, perform answers, re-enable, confirm sync (**Project Summary: Non-Functional Requirements – Offline Support**).
5.  Test push notifications delivery on both iOS and Android devices (**Project Summary: Core Features**).
6.  Confirm unit, E2E, and CI all passing; fix any regression bugs (**Project Summary: Quality Assurance**).

*Total Steps: 45*
