## Next Steps
Below is a phase-based plan to kick off the MVP development, followed by a proposed folder structure and initial setup commands.

---

### 1. Project Initialization & Tooling

1.  Install global prerequisites:
   • Node.js (LTS)
   • Expo CLI (`npm install -g expo-cli`)
   • Yarn or npm
2.  Initialize Expo + TypeScript project:
   ```bash
   expo init daily-questions-coach
   # Choose “blank (TypeScript)” template
   cd daily-questions-coach
   yarn add expo-secure-store expo-sqlite react-native-gesture-handler react-native-reanimated @react-navigation/native @react-navigation/stack firebase expo-apple-authentication expo-google-sign-in onesignal-expo-plugin
   ```
3.  Add linting, formatting, and security checks:
   • ESLint with TypeScript support
   • Prettier
   • Husky + lint-staged

### 2. Define Folder Structure

```
daily-questions-coach/
├── assets/                 # images, fonts, splash icons
├── src/
│   ├── api/                # wrappers: OneSignal, Firebase Analytics
│   ├── auth/               # Google, Apple, email/password flows
│   ├── components/         # reusable UI (Button, Input, Card)
│   ├── hooks/              # custom hooks (useStreaks, useEncryption)
│   ├── navigation/         # React Navigation stacks & screens
│   ├── screens/            # Onboarding, Home, Questions, Settings
│   ├── services/           # encryption, secure store, sqlite
│   ├── store/              # Redux or Context for state management
│   ├── types/              # TypeScript interfaces & enums
│   └── utils/              # validators, formatters, constants
├── .env                    # environment variables (not checked in)
├── app.json                # Expo config
├── package.json
└── tsconfig.json
```  

### 3. Security & Configuration

- **Secure Storage**: Use `expo-secure-store` for encryption of sensitive data (answers, credentials).  
- **Database Encryption**: Layer SQLite with a simple encryption wrapper (e.g., SQLCipher plugin or manual AES-256 on blob fields).  
- **Env/Secrets**: Load API keys (Firebase, OneSignal) via `.env` and inject with `babel-plugin-inline-dotenv` or Expo's secret config.  
- **Authentication**:  
  • Email/password: hash with bcrypt before storage.  
  • Google/Apple: validate tokens server-side if a backend exists (future), or rely on SDKs’ secure grants.  
- **Network**: All external calls (analytics, push) over HTTPS.  
- **Notifications**: Integrate OneSignal via native plugin; configure permissions and handle offline fallback.  

### 4. Initial Tasks & Deliverables

1. **Environment Setup**  
   • Repo creation, branch protection, CI pipeline stub (lint/tests).  
2. **Onboarding Flow**  
   • Screens: Welcome → Auth selection → Sample Qs.  
   • Secure local account creation with encryption.  
3. **Local Data Layer**  
   • Build SQLite schema: users, questions, answers, metadata (timestamps).  
   • Encryption service: wrap read/write calls.  
4. **Daily Dashboard**  
   • Scaffold screen showing questions with input components.  
   • Autosave logic and streak calculation hook.  

---

Let me know which area you’d like to tackle first—or if you’d prefer I spin up the Expo project and implement the onboarding screens as a code sample.