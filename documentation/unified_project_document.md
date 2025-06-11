# Unified Project Documentation

## Project Requirements Document

### 1. Project Overview
Daily Questions Coach is a mobile-first app that helps people build self-improvement habits by answering a small set of personal reflection questions every day. Inspired by Marshall Goldsmith’s Daily Questions method, it lets users set or choose up to 20 questions with simple input types (yes/no, numeric, or short text), answer them in under two minutes, and celebrate their streaks. All data is kept on the device, so the experience is private, fast, and fully available offline.

We are building this app to give people a friendly, supportive, and minimalist tool to stay accountable and see their progress over time. Success means getting at least 100 active users in the first month, achieving 40% daily engagement, maintaining 70% of early users for at least 14 days in a row, and gathering feedback from 20 users. By tracking key metrics like daily active users, streak length, and onboarding completion, we’ll know if we’ve found the right product–market fit.

### 2. In-Scope vs. Out-of-Scope

In-Scope (MVP)  
• Onboarding & Account Management with Google Sign-In, Apple Sign-In, or email/password stored locally  
• First-time walkthrough with privacy notice, default questions, and reminder setup  
• Create, edit, archive (preserves history), or delete (purges history) up to 20 custom reflection questions  
• Daily reflection dashboard showing today’s questions in a single scroll with autosave, skip option, and confirmation overlay  
• Push notifications only, configurable reminder time, deep-link to today’s dashboard, OS-native snooze/dismiss  
• Progress view with calendar and simple trend chart, showing current and longest streaks and completion percentage  
• Settings to manage reminders, question list, and account; placeholder for CSV export via share sheet  
• Offline-first behavior with encrypted local storage (SQLite or secure storage)

Out-of-Scope (Future)  
• AI-generated coaching, advice, or summaries  
• Social feeds, public sharing, or group accountability beyond solo use  
• Email reminder fallback, cloud data sync, or remote storage  
• Desktop web/PWA support or advanced analytics dashboards  
• Automated CSV export via email

### 3. User Flow
When a new user opens the app, they see a branded splash screen that fades into a choice of Google Sign-In, Apple Sign-In, or a simple email/password form. After entering credentials, they view a privacy notice explaining that all data stays on their device. Next they pick a daily reminder time and choose either a set of suggested starter questions or create up to six custom prompts. A brief animated walkthrough highlights the dashboard, progress view, and settings before landing the user on the main reflection screen for today.

Each day at the chosen time, the user receives a push notification reading, “Time for your Daily Questions.” Tapping it opens the dashboard with all active questions in a single scroll. The user taps toggles or enters values, and each response saves instantly. When they finish or skip, a “Well done!” overlay shows their updated streak. From there, they can swipe to the Insights tab for a calendar view and trend chart of past answers, or go to Settings to add, archive, or delete questions and adjust reminders. All data and preferences remain securely stored on the device, even when offline.

### 4. Core Features
- **Authentication & Account**: On-device email/password plus Google and Apple OAuth; secure local credential storage; profile edit and account deletion.  
- **Question Management**: Create, edit, archive (keeps history), delete (removes history) up to 20 questions; choose input format (toggle, numeric, text).  
- **Daily Reflection Flow**: Single-scroll dashboard for today’s questions; large touch targets; autosave; optional skip; completion overlay with streak and animation.  
- **Reminders & Notifications**: Daily push reminders via OneSignal or native SDK; configurable time; deep-link; OS-native snooze/dismiss.  
- **Progress Tracking & Insights**: Calendar view of answered vs. missed days; simple line/bar charts for yes/no percentages or numeric trends; current and longest streaks; completion rate.  
- **Settings & Data Export**: Manage reminder times, question list, and privacy info; placeholder for CSV export via share sheet.  
- **Offline Support & Security**: Encrypted local storage (SQLite or secure storage); offline queuing and seamless recovery when online.

### 5. Tech Stack & Tools
- Framework: Expo + React Native targeting iOS 13+ and Android 8+ (phones only)  
- Language: TypeScript  
- Local Storage: Encrypted SQLite or secure storage library  
- Notifications: OneSignal SDK or native push services  
- Authentication: Google Sign-In, Apple Sign-In, local email/password  
- Analytics: Firebase Analytics for DAU, retention, streak tracking  
- IDE & Extensions: Bolt for scaffolding and best practices; Cursor for AI-powered coding suggestions  
- Version Control: Git with GitHub  
- Styling: React Native Stylesheets, WCAG AA–compliant color contrast

### 6. Non-Functional Requirements
- Performance: App launch under 2 s; screen transitions under 100 ms; data read/write under 50 ms.  
- Security & Privacy: AES-256 encryption at rest; no data leaves device in MVP; clear privacy notice on onboarding.  
- Usability & Accessibility: WCAG AA color contrast; touch targets at least 44×44 pt; support for screen readers and dynamic font sizes.  
- Reliability: Offline-first behavior with sync on reconnect; push delivery success ≥95%; core flows error rate ≤0.5%.

### 7. Constraints & Assumptions
- No backend server or remote database for MVP; all data on device.  
- Target devices: iOS 13+ and Android 8+ phones only.  
- OneSignal or native push free tier suffices initially.  
- Encryption keys managed via device’s secure storage.  
- Bolt and Cursor available for scaffolding and development.  
- Future cloud sync will require API versioning and migration strategy.

### 8. Known Issues & Potential Pitfalls
- Offline Sync Conflicts: Mitigation by timestamping entries and using last-write-wins logic.  
- Notification Reliability: Mitigation by testing across OS versions and providing local scheduling fallback.  
- Data Loss on Question Deletion: Mitigation by requiring archive first and confirming full deletion clears history.  
- Local Authentication Security: Mitigation by leveraging platform secure storage and enforcing encryption best practices.  
- Analytics Scalability: Mitigation by tracking only core events and batching uploads on network availability.

---

## App Flow Document

### Onboarding and Sign-In/Sign-Up
A new user opens the app and sees a friendly splash screen before moving into a clean sign-up interface. Users can choose Google Sign-In, Apple Sign-In, or enter an email and password. After they submit credentials, the app shows a brief privacy notice that data stays on device. Next, users pick a daily reminder time and decide whether to accept suggested starter questions or create up to six of their own. A short animated walkthrough then points out the dashboard, progress view, and settings before taking them to the main dashboard.

### Main Dashboard or Home Page
Once signed in, the user lands on today’s reflection dashboard. The top shows the date and a progress indicator. Below is a single-scroll list of questions with large toggles or text fields. A bottom navigation bar lets users switch to the Insights view or Settings. The minimal header keeps focus on answering questions, and the overall layout feels calm and uncluttered.

### Detailed Feature Flows and Page Transitions
To answer questions, the user taps toggles or types a number or short text. Each response saves immediately. If they skip any question, the app marks it as skipped. When all questions have been addressed, an overlay slides up with a “Well done!” message, shows the updated streak, and includes a subtle confetti animation. From there, tapping anywhere returns to the dashboard, now with a checkmark icon by the date. Swiping or tapping the Insights icon takes the user to a calendar view and a simple chart, and tapping Settings opens question management, reminder controls, and account options. Creating or editing questions brings up a full-screen form with text input and response type selection.

### Settings and Account Management
In Settings, users change their reminder time with a time picker or toggle notifications off. The question list appears with options to edit, archive, or delete each prompt. Creating a new question involves adding text, picking yes/no, numeric, or text input, and tapping Save. Under Account, users can update their email or password, sign out of OAuth, request a CSV export via the device share sheet, or delete their account—prompting a confirmation that all local data will be removed. After any change, a brief toast confirms success and tapping Back returns to the last view.

### Error States and Alternate Paths
If the user enters invalid data (for example, non-numeric text in a numeric field), the app shows an inline error message and prevents saving until fixed. If there’s no network when fetching remote resources, the app continues to work offline and retries in the background. If push permissions are denied, the app notifies the user with a gentle prompt and falls back to in-app reminders. Lost credentials can be recovered via the standard email link flow or by re-authenticating with Google or Apple. Every error state offers a clear message and a single tap to try again or return home.

### Conclusion and Overall App Journey
From first launch to daily habit tracking, the app guides users with friendly prompts, simple controls, and minimal friction. They sign up, set reminders, answer questions in under two minutes, celebrate streaks, and explore insights without ever leaving their device. The streamlined flow keeps people focused on reflection and self-improvement, making consistency and progress effortless.

---

## Tech Stack Document

### Frontend Technologies
- **Expo & React Native** for building a cross-platform mobile app with a native feel.  
- **TypeScript** for type safety and clearer code.  
- **React Native Stylesheets** to keep styling simple and performant.  
- **React Navigation** for smooth screen transitions and deep links.  
- **WCAG AA–compliant color contrast** to ensure accessibility.

### Backend Technologies (Local)
- **Encrypted SQLite** as the primary on-device database for user questions and answers.  
- **Secure Storage Library** for storing credentials and encryption keys.  
- **Local Authentication Service** handling Google, Apple, and email/password flows without a remote server.

### Infrastructure and Deployment
- **Git & GitHub** for version control and pull request workflow.  
- **Expo Application Services (EAS)** for building and publishing iOS and Android binaries.  
- **Continuous Integration** with GitHub Actions to run linting and tests on every commit.  
- **Environment Management** via .env files and secure secret storage for API keys.

### Third-Party Integrations
- **Google Sign-In & Apple Sign-In** for quick and trusted user authentication.  
- **OneSignal SDK** for reliable push notifications across platforms.  
- **Firebase Analytics** for tracking DAU, retention, streaks, and key events.  
- **Bolt & Cursor** for AI-powered scaffolding, best practices, and coding assistance.

### Security and Performance Considerations
- **Encryption at Rest**: AES-256 for all stored data.  
- **Offline-First Architecture**: data reads/writes local with seamless reconnect sync.  
- **Performance Targets**: launch under 2 s; response under 50 ms.  
- **Authentication Safety**: leverage platform secure enclaves and token management.

### Conclusion and Overall Tech Stack Summary
This stack uses Expo and React Native with TypeScript to deliver a fast, native-feeling mobile app. Encrypted SQLite and secure storage keep data private and accessible offline. Firebase Analytics and OneSignal ensure we can measure success and reliably remind users. GitHub Actions and EAS streamline builds and deployments. Tools like Bolt and Cursor speed up development without sacrificing best practices.

---

## Frontend Guidelines Document

### Frontend Architecture
We use a modular, component-based structure with Expo and React Native at its core. Each screen lives in its own folder under an `app` directory, with shared UI elements in a `components` folder. This setup supports scalability by making it easy to add new features or modify existing ones. TypeScript provides strong typing, reducing runtime errors and improving code readability.

### Design Principles
We follow four key principles: usability, accessibility, responsiveness, and minimalism. Usability means large touch targets and clear feedback. Accessibility ensures WCAG AA color contrast and support for screen readers. Responsiveness guarantees the UI adapts to different screen sizes. Minimalism removes distractions so users focus on answering questions quickly.

### Styling and Theming
We use React Native Stylesheets for lightweight styling. The primary palette features pastel blue (#AEDFF7) and green (#C8E6C9) accents on a white background. We choose a clean, sans-serif font like Roboto or Open Sans. Theming is handled via a global theme file with color and spacing constants, ensuring consistency across components.

### Component Structure
Components are organized into `/components/ui` for basic elements like buttons and inputs, and `/components/modules` for feature-specific parts like the question card or calendar view. Each component is self-contained, with its own styles and tests. This encourages reuse and makes it easy to maintain or replace parts without side effects.

### State Management
We keep state mostly local to each screen using React’s `useState` and `useReducer`. Shared state, such as user preferences or theme, lives in a lightweight React Context. This avoids the complexity of large global stores while still allowing cross-screen data sharing.

### Routing and Navigation
We use React Navigation with a bottom tab navigator for Dashboard, Insights, and Settings. Stack navigators handle flows like onboarding and question editing. Deep links from notifications open the app directly to the dashboard. Navigation options and headers are defined alongside each stack for clarity.

### Performance Optimization
Screens and heavy components are lazy-loaded using React’s `lazy` and `Suspense`. We memoize pure components with `React.memo` and expensive calculations with `useMemo`. Assets are optimized via Expo’s asset bundling. This keeps load times low and memory usage minimal.

### Testing and Quality Assurance
Unit tests use Jest and React Native Testing Library to verify component logic and UI rendering. Integration tests cover flows like onboarding and daily reflection. End-to-end tests use Detox to simulate real user interactions on devices. We run tests on every CI build and require 100% pass before merging.

### Conclusion and Overall Frontend Summary
Our frontend setup combines Expo, React Native, and TypeScript with a clear component structure and simple state management. We emphasize usability, accessibility, and performance through consistent theming, lazy loading, and rigorous testing. This approach ensures a maintainable codebase and a smooth, minimalist user experience.

---

## Implementation Plan
1. Scaffold the project using Bolt with Expo and TypeScript template.  
2. Set up folder structure: `app`, `components`, `hooks`, `config`, and `assets`.  
3. Integrate React Navigation and build the onboarding flow (splash, auth, walkthrough).  
4. Implement local authentication with secure storage, Google, and Apple sign-in.  
5. Build question management screens with create, edit, archive, and delete features.  
6. Develop the daily reflection dashboard with autosave and skip logic.  
7. Integrate encrypted SQLite for storing questions and answers.  
8. Add push notifications via OneSignal with deep-link handling.  
9. Create the Insights view with calendar and trend chart components.  
10. Implement Settings screens for reminders, account, and CSV export placeholder.  
11. Integrate Firebase Analytics and log core events.  
12. Apply theming, styling, and accessibility tweaks.  
13. Write and run unit, integration, and e2e tests; fix bugs.  
14. Configure GitHub Actions for CI and EAS for builds.  
15. Prepare app store assets, privacy policy, and submit to iOS App Store and Google Play.

This plan gives a clear, step-by-step path from project setup to public launch, ensuring each feature is built, tested, and deployed with quality and user experience in mind.