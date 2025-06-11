# Tech Stack Document for Daily Questions Coach

This document explains, in everyday language, the technology choices behind the Daily Questions Coach mobile app. It’s designed to help non-technical readers understand why each tool or library was selected and how it contributes to a friendly, fast, and secure user experience.

## 1. Frontend Technologies

The frontend is everything the user sees and interacts with. We chose tools that deliver a smooth, native-like mobile experience on both iOS and Android devices without having to write separate apps for each platform.

• **Expo + React Native**

*   Lets us write one codebase in JavaScript/TypeScript that runs on both iOS (13+) and Android (8+) phones.
*   Provides access to native device features (camera, notifications) with minimal setup.
*   Speeds up development with hot reloading and easy testing on real devices.

• **TypeScript**

*   A version of JavaScript that adds simple checks as we write code, helping catch mistakes early.
*   Improves code clarity, making it easier to maintain and expand the app over time.

• **React Native Stylesheets**

*   A built-in way to style components (buttons, lists, text) that feels similar to CSS but works seamlessly on mobile.
*   Ensures consistent layout, spacing, and typography across different screen sizes.

• **Bolt & Cursor**

*   **Bolt** provides project scaffolding and best-practice templates, so our code starts organized and follows proven patterns.
*   **Cursor** offers AI-assisted coding suggestions within our IDE, helping developers write quality code faster.

## 2. Backend Technologies

For the MVP, we deliberately chose **no remote server or cloud database**. Instead, all data lives on the user’s device. This keeps the app private, fast, and fully functional offline.

• **Encrypted SQLite (via Secure Storage library)**

*   Stores user questions, daily answers, and streak data locally, with AES-256 encryption at rest.
*   Gives quick read/write performance (<50 ms), ensuring answering daily questions is frictionless.

• **Local Authentication**

*   Handles email/password login entirely on the device, with credentials stored securely.
*   Enables sign-in without requiring a backend, while laying the groundwork for future cloud sync.

• **Firebase Analytics**

*   A lightweight analytics service integrated into the app to track key metrics (DAU, retention, streaks).
*   Does not store personal answers—only anonymous event data to help us understand usage patterns.

## 3. Infrastructure and Deployment

These choices keep our project organized, ensure reliable builds, and let us release updates quickly.

• **Version Control: Git & GitHub**

*   All code lives in a GitHub repository, tracking history and enabling easy collaboration.
*   Pull requests and code reviews help maintain quality and consistency.

• **CI/CD with GitHub Actions & Expo**

*   Automated workflows run tests and build the app whenever code is pushed.
*   Expo’s build service generates installable iOS and Android packages, streamlining app store submissions.

• **Project Structure (from Starter Kit)**

*   Organized folder layout (app, components, config, assets) ensures code is easy to find and maintain.
*   Starter kit patterns (screens, layouts, hooks) accelerate development and enforce consistency.

## 4. Third-Party Integrations

We rely on proven services to handle specialized tasks, so we can focus on delivering a great user experience.

• **Google Sign-In & Apple Sign-In**

*   Offer quick, secure login options familiar to most users.
*   Apple Sign-In is mandatory for iOS App Store distribution and aligns with Apple’s privacy guidelines.

• **OneSignal (Push Notifications)**

*   Manages daily reminder notifications reliably on both iOS and Android.
*   Supports deep-linking so tapping the notification opens the daily questions dashboard.

• **Firebase Analytics**

*   (Also listed under Backend) Collects usage data such as onboarding completion, answers submitted, and notification opens.
*   Helps us measure success metrics and make data-driven improvements.

## 5. Security and Performance Considerations

Our goal is to keep data private, the app fast, and interactions smooth.

Security Measures

• **Encryption at Rest**

*   All user data (questions, answers, credentials) is encrypted on the device using industry-standard AES-256.
*   Ensures that even if someone gains physical access to the device, data remains protected.

• **On-Device Authentication**

*   No sensitive data is sent to a server in the MVP, reducing exposure risk.
*   Future backend sync will use secure APIs and token-based auth.

Performance Optimizations

• **Offline-First Design**

*   The app never waits on a network call to let users answer questions or view history.
*   Local storage operations are optimized for quick responses (<50 ms).

• **Lightweight UI**

*   Minimal animations and simple layouts keep memory and CPU usage low, helping the app launch in under 2 seconds.
*   Large touch targets and clear typography ensure interactions feel instant.

## 6. Conclusion and Overall Tech Stack Summary

Our technology choices strike the right balance between speed, privacy, and ease of use. By building on Expo and React Native with TypeScript, we deliver a native-like mobile app quickly. Local storage and on-device authentication give users total privacy and an offline-first experience. Integrations like Google/Apple Sign-In, OneSignal, and Firebase Analytics let us focus on the core habit-building features while relying on proven services for login, notifications, and usage tracking.

Unique aspects that set Daily Questions Coach apart:

• Fully private MVP with no backend or cloud sync required\
• Cross-platform native feel from a single codebase\
• Encrypted on-device storage for maximum user trust\
• Rapid development and iteration enabled by Bolt, Cursor, and Expo’s tooling

Together, this tech stack underpins a friendly, supportive, and frictionless experience, helping users stay accountable to their self-improvement goals every day.
