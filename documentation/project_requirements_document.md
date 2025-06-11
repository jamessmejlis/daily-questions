# Project Requirements Document

## 1. Project Overview

Daily Questions Coach is a mobile-first app designed to help individuals build self-improvement habits by answering a small set of personal reflection questions each day. Inspired by Marshall Goldsmith’s Daily Questions method, the app prompts users to set or choose up to 20 questions (yes/no toggles, numeric values, or short text), answer them in under two minutes, and celebrate their streaks. All data stays on the device, making the experience private, fast, and available offline.

We’re building this to give people a frictionless, friendly way to stay accountable and track progress over time. Key success criteria include high daily engagement (≥40% of users), strong streak retention (70% using it for 14+ consecutive days), and collecting early feedback from at least 20 users. We’ll validate product-market fit by reaching 100+ active users in month one and monitoring core metrics like DAU, streak length, and onboarding completion.

## 2. In-Scope vs. Out-of-Scope

### In-Scope (MVP)

*   **Onboarding & Account Management**\
    • Sign up / login via Google Sign-In, Apple Sign-In, or email/password (all handled locally, no backend)\
    • First-time walkthrough: privacy notice, default questions, reminder setup\
    • Edit profile, change credentials, delete account (wipes local data)
*   **Question Management**\
    • View default questions, add/edit/archive/delete up to 20 custom questions\
    • Choose answer type: yes/no toggle, numeric input, or short text\
    • Archiving preserves past answers; deleting removes historic data
*   **Daily Reflection Flow**\
    • Dashboard shows today’s questions in a single scroll\
    • Large touch targets, autosave per input, skip any question\
    • “Well done!” overlay with current streak count and light animation
*   **Reminders & Notifications**\
    • Push notifications only (via OneSignal or native SDK)\
    • Configurable daily reminder time, deep-link to today’s dashboard\
    • Snooze and dismiss handled by OS
*   **Progress Tracking & Insights**\
    • Calendar view highlighting answered vs. missed days\
    • Simple trend chart of yes/no percentages or numeric values\
    • Display current and longest streak, completion percentage
*   **Settings & Data Management**\
    • Adjust notification times, manage question list, theme preferences\
    • Request CSV export via device share sheet (placeholder flow)\
    • Clear privacy policy, all data encrypted at rest

### Out-of-Scope (Planned for Future)

*   AI-generated coaching, advice, or summaries
*   Social feeds, public sharing, or full group accountability features
*   Email reminder fallback (push only in MVP)
*   Cloud sync or remote storage of responses
*   Advanced analytics dashboards, desktop web/PWA support
*   CSV export via email automation

## 3. User Flow

When a new user opens the app, they see a branded splash screen that fades into a signup prompt offering Google, Apple, or email/password options. After authentication, they view a brief privacy notice and choose a daily reminder time. The onboarding continues with a choice of suggested starter questions or an option to create up to six custom prompts. A quick animated walkthrough highlights the dashboard, progress view, and settings before landing the user on today’s reflection screen.

Each day, the user receives a push notification at their set time. Tapping it deep-links into the dashboard showing all active questions in a single scroll. They tap toggles or enter values into text fields—responses save instantly. When finished (or skipped), a celebratory overlay shows their updated streak. From there, users can swipe to the Insights tab to see a calendar and trend chart of past answers, or tap Settings to add/edit questions and change reminder times. All changes and data persist securely on the device, even offline.

## 4. Core Features

*   **Authentication & Account**\
    • On-device email/password + Google/Apple OAuth\
    • Secure local storage of credentials and user data\
    • Profile editing and account deletion
*   **Question Configuration**\
    • Create, edit, archive, delete up to 20 questions\
    • Three input formats: yes/no toggle, numeric, short text\
    • Archive retains history, delete purges related data
*   **Daily Reflection**\
    • Single-page dashboard for today’s questions\
    • Large, accessible controls; autosave; skip option\
    • Completion confirmation with streak and simple animation
*   **Notifications**\
    • Daily push reminders via OneSignal or platform SDKs\
    • Deep-link to reflection screen; OS-native snooze/dismiss
*   **Progress & Insights**\
    • Calendar view of answered vs. missed days\
    • Line/bar chart showing percent answered or numeric trends\
    • Current streak, longest streak, and completion rate display
*   **Settings & Export**\
    • Notification scheduling, question management, privacy info\
    • Placeholder for CSV export via device share sheet
*   **Offline & Security**\
    • Encrypted local SQLite or secure storage\
    • Offline queuing with seamless recovery when online

## 5. Tech Stack & Tools

*   **Framework**: Expo + React Native (iOS 13+ / Android 8+ phones only)
*   **Language**: TypeScript
*   **Local Storage**: Encrypted SQLite or secure storage library
*   **Notifications**: OneSignal SDK or native push services
*   **Authentication**: Google Sign-In, Apple Sign-In, email/password (local)
*   **Analytics**: Firebase Analytics for DAU, retention, streak tracking
*   **IDE & Extensions**: Cursor (AI-powered suggestions), Bolt (scaffolding & best practices)
*   **Version Control**: Git (GitHub)
*   **Styling**: React Native Stylesheets, WCAG AA–compliant color contrast

## 6. Non-Functional Requirements

*   **Performance**\
    • App launch <2 seconds, screen transitions <100 ms\
    • Storage reads/writes <50 ms for daily entry
*   **Security & Privacy**\
    • AES-256 encryption at rest\
    • No data leaves device in MVP\
    • Transparent privacy notice during onboarding
*   **Usability & Accessibility**\
    • WCAG AA color contrast\
    • Large touch targets (minimum 44×44 pt)\
    • Support screen readers and dynamic font sizes
*   **Reliability**\
    • Offline-first behavior; data sync/resume on reconnect\
    • Push delivery success ≥95%

## 7. Constraints & Assumptions

*   No backend server or remote database for MVP—everything on device
*   Users run iOS 13+ or Android 8+ on phones only
*   OneSignal (or native push) free tier is sufficient initially
*   Encryption keys managed via secure storage on device
*   Bolt and Cursor tools available for scaffolding and coding
*   Future cloud sync will require API versioning and migration plans

## 8. Known Issues & Potential Pitfalls

*   **Offline Sync Conflicts**\
    • Mitigation: timestamp every entry and apply last-write-wins logic
*   **Push Notification Reliability**\
    • Mitigation: test across iOS/Android versions; fallback scheduling via OS alarms
*   **Question Deletion Side Effects**\
    • Mitigation: archive feature first, confirm deletion clears history
*   **Local Authentication Security**\
    • Mitigation: leverage platform secure storage, enforce app-specific encryption keys
*   **Scaling Analytics**\
    • Mitigation: limit tracked events to core metrics and batch uploads when online

This document fully defines the MVP scope, user journey, features, tech choices, and constraints. It’s the single source of truth for generating detailed technical specs, UI guidelines, backend structures, and implementation plans without ambiguity.
