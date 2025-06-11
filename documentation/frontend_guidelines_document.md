# Frontend Guideline Document

This document outlines the architecture, design principles, and technologies for the **Daily Questions Coach** mobile app frontend. It is written in everyday language so anyone can understand how the app is built and why.

## 1. Frontend Architecture

### 1.1 Overview

*   **Framework**: Expo managed workflow with React Native.

*   **Language**: TypeScript for type safety and clearer code.

*   **Libraries & Tools**:

    *   **React Navigation** for screens and navigation.
    *   **Redux Toolkit** + **Redux Persist** for state management and local persistence.
    *   **SQLite** (encrypted via AES-256) or SecureStore for on-device storage.
    *   **OneSignal SDK** (or native APIs) for push notifications.
    *   **Firebase Analytics** for usage tracking.
    *   **Bolt** for scaffolding and project conventions.
    *   **Cursor** for AI-powered coding assistance.
    *   **Git & GitHub** for version control.

### 1.2 Scalability, Maintainability, Performance

*   **Scalability**: Modular folder structure and feature-based code splitting allow new features to be added without touching unrelated code.
*   **Maintainability**: TypeScript, clear naming conventions, linting, and unit tests keep code predictable and reduce bugs.
*   **Performance**: Hermes engine (optional), lazy-loaded screens, virtualized lists (FlatList), and optimized assets keep the app fast on most devices.

## 2. Design Principles

*   **Usability**: Simple, clear flows. Users see only what they need—questions for the day, one screen at a time.
*   **Accessibility**: High-contrast colors, sufficient font sizes, and proper label usage so that screen readers and other assistive tools work.
*   **Responsiveness**: Mobile-first layout that adapts to various phone screens; buttons and inputs sized for thumb use.
*   **Consistency**: Reuse common components (buttons, inputs, cards) so users learn the interface quickly.
*   **Minimalism**: Remove distractions. Friendly microcopy guides users rather than overwhelm them.

*Application of Principles in UI*

*   Onboarding uses clear step indicators.
*   Active questions list is a scrollable FlatList for smooth performance.
*   Toggle and input fields follow the same touch and spacing rules.

## 3. Styling and Theming

### 3.1 Styling Approach

*   **CSS-in-JS** with **styled-components** (or Emotion) for scoped, dynamic styles.
*   Base styles defined in a shared theme object. Reusable style utilities (spacing, typography).

### 3.2 Theming

*   Single light theme for MVP. Theme object holds colors, font sizes, spacing, and radius values.
*   Theming provider at the app root (`ThemeProvider`) makes theme values available in all components.

### 3.3 Visual Style

*   **Style**: Flat and modern with subtle shadows and smooth rounded corners.
*   **Look & Feel**: Friendly and minimalist, no heavy textures.

### 3.4 Color Palette

*   **Primary**: #4A90E2 (blue)
*   **Secondary**: #50E3C2 (teal)
*   **Background**: #FFFFFF (white)
*   **Surface/Card**: #F5F5F5 (light gray)
*   **Text Primary**: #333333 (dark charcoal)
*   **Text Secondary**: #777777 (medium gray)
*   **Accent/Error**: #E94E77 (pinkish-red)

### 3.5 Typography

*   **Font Family**: “Inter” (cross-platform, clean and legible).

*   **Sizing Scale**:

    *   Heading: 24px
    *   Subheading: 18px
    *   Body text: 16px
    *   Small text: 14px

## 4. Component Structure

### 4.1 Organization

*   `/src/components`: Reusable UI components (Button, Input, Card, Toggle).
*   `/src/features`: Feature folders (onboarding, auth, questions, dashboard, settings). Each has its own subfolders for screens, hooks, and local state.
*   `/src/navigation`: Navigation stacks and tab configs.
*   `/src/services`: API wrappers (OneSignal, SQLite service) and analytics.
*   `/src/theme`: Theme definitions and global styles.

### 4.2 Reusability & Maintainability

*   Atomic-like approach: small, focused components that can be combined.
*   Avoid duplication by centralizing shared logic and UI elements.

## 5. State Management

### 5.1 Approach

*   **Redux Toolkit** for predictable global state, with slices per feature (e.g., authSlice, questionsSlice, settingsSlice).
*   **Redux Persist** to sync parts of Redux state to encrypted device storage so data persists between sessions.

### 5.2 Data Flow

1.  User actions dispatch Redux actions (e.g., addAnswer).
2.  Reducers update the state immutably.
3.  Middleware (if any) handles side effects, like writing to SQLite or scheduling notifications.
4.  Components select slices of state via selectors and re-render only on relevant changes.

## 6. Routing and Navigation

*   **Library**: React Navigation (v6).

*   **Stacks**:

    *   **Auth Stack**: Sign In, Sign Up, Password Reset.
    *   **Onboarding Stack**: Welcome screens, sample questions.
    *   **Main Tab Navigator**: Dashboard, Questions, Insights, Settings.

*   **Deep Links & Paths**: Configured to handle notification taps and welcome links.

*   **Navigation Patterns**: Modal screens for adding/editing questions and confirmation dialogs.

## 7. Performance Optimization

*   **Lazy Loading**: Load heavy screens/components only when needed (`React.lazy` + `Suspense`).
*   **Virtual Lists**: Use `FlatList` for question lists and calendar views.
*   **Memoization**: `React.memo`, `useMemo`, and `useCallback` to avoid unnecessary re-renders.
*   **Asset Optimization**: Compress images, use vector icons (react-native-vector-icons), and bundle fonts.
*   **Hermes**: Enable Hermes on Android (and iOS if desired) for faster startup and lower memory.
*   **Bundle Splitting**: Rely on Metro bundler’s `require` statements and dynamic imports for smaller initial payloads.

## 8. Testing and Quality Assurance

### 8.1 Automated Testing

*   **Unit Tests**: Jest + React Native Testing Library for pure functions, reducers, and small components.
*   **Integration Tests**: Testing Library to verify component interactions and Redux integration.
*   **E2E Tests**: Detox for full flows (onboarding, daily answer, notifications).

### 8.2 Linting & Formatting

*   **ESLint** (with Airbnb or React Native community rules) for code quality.
*   **Prettier** for consistent styling.
*   **Husky & lint-staged** to run linting and tests before commits.

### 8.3 CI/CD

*   **GitHub Actions**: Runs lint, type checks (`tsc --noEmit`), tests, and build validation on every PR.

## 9. Conclusion and Overall Frontend Summary

The **Daily Questions Coach** app uses a modern, mobile-first frontend stack built on Expo + React Native and TypeScript. Our architecture leverages modular components, Redux Toolkit for state, and secure on-device storage to deliver a fast, maintainable, and private self-reflection experience. Design principles—usability, accessibility, and minimalism—shine through a clean flat UI, consistent theming, and responsive layouts. Performance optimizations, thorough testing, and clear project conventions ensure the app remains reliable and easy to extend in the future.

By following these guidelines, any developer joining the project will understand how pieces fit together and how to add new features without friction.
