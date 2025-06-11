# Backend Structure Document

This document outlines the backend architecture, hosting, and infrastructure for the Daily Questions Coach app. It uses clear, everyday language so anyone can understand the overall setup.

## 1. Backend Architecture

We chose a **serverless** architecture built on **Firebase**. This means we don’t run or manage our own servers—instead, Firebase handles scaling and availability for us. Key parts:

- Authentication via Firebase Auth (email/password, Google, Apple)
- Data storage in Cloud Firestore (NoSQL) with offline support
- Cloud Functions for any custom server-side logic (e.g., CSV export in future)
- Push notifications through Firebase Cloud Messaging or OneSignal
- Analytics via Firebase Analytics

How it supports our goals:

- **Scalability**: Firebase automatically scales to handle thousands of users.
- **Maintainability**: We write small, focused Cloud Functions and use Firebase’s console to manage rules, deployments, and logs in one place.
- **Performance**: Firestore offers fast reads and writes. It caches data on-device so users get an instant experience even with spotty connectivity.

## 2. Database Management

### Technologies Used

- Firestore (NoSQL document database)
- Local on-device storage (SQLite or SecureStore) for fast startup and offline mode
- Firebase Auth user store for account data

### Data Flow & Practices

- On first login, we sync the user’s cloud data into local storage.
- All writes go to both Firestore and local storage. If offline, writes queue locally and sync when connectivity returns.
- Firestore’s built-in encryption at rest and in transit keeps user data safe.
- We enforce strict Firestore Security Rules so users can only access their own documents.

## 3. Database Schema

### Collections & Documents (Firestore)

Users (collection)
- Document ID: `userId`
- Fields:
  - `email` (string)
  - `displayName` (string)
  - `createdAt` (timestamp)
  - `settings` (map)
    - `notificationTime` (string)
    - `notificationsEnabled` (boolean)

Questions (subcollection of each User document)
- Document ID: `questionId`
- Fields:
  - `text` (string)
  - `type` (string: "toggle", "numeric", "text")
  - `isArchived` (boolean)
  - `order` (number)

Responses (subcollection of each Question document)
- Document ID: `responseId`
- Fields:
  - `date` (date)
  - `answer` (boolean, number, or string)
  - `createdAt` (timestamp)

### Local Storage Schema (SQLite)

Tables mirror the Firestore structure:
- `users` table: id, email, display_name, created_at, notifications_enabled, notification_time
- `questions` table: id, user_id, text, type, is_archived, order
- `responses` table: id, question_id, date, answer, created_at

## 4. API Design and Endpoints

We rely primarily on the **Firebase SDKs** instead of building a traditional REST API. For custom needs (exporting CSV, advanced insights), we’ll add **Cloud Functions** with HTTP endpoints.

### Key Endpoints (Cloud Functions)

- **GET /export-csv**
  - Purpose: Generate a CSV of all user responses for data export
  - Auth: Firebase ID token required

- **POST /send-custom-report** (future)
  - Purpose: Email a custom progress report
  - Auth: Firebase ID token required

For day-to-day data operations, the app communicates directly with Firestore:

- `firestore().collection('Users').doc(userId)` to read/update user settings
- `firestore().collection('Users').doc(userId).collection('Questions')` for question management
- `firestore().collection('Users').doc(userId).collection('Questions').doc(questionId).collection('Responses')` to save and fetch answers

## 5. Hosting Solutions

We host nothing on our own servers. Instead, we use Firebase’s managed services:

- **Cloud Functions**: Hosted by Google, auto-scaled and patched
- **Firebase Hosting**: (If we build any web landing page or admin panel)
- **Firestore & Auth**: Fully managed, globally available

Benefits:
- **Reliability**: Google’s SLA and global infrastructure
- **Scalability**: Instantly handle traffic spikes
- **Cost-effectiveness**: Pay only for what we use, no server rental or maintenance costs

## 6. Infrastructure Components

- **Load Balancers**: Built into Firebase, distribute requests across multiple instances
- **CDN**: Firebase Hosting uses a global CDN
- **Caching**: Firestore caches data on the device and uses in-memory cache on the server side
- **Push Notification Service**: Firebase Cloud Messaging (or OneSignal) handles device tokens, routing, and delivery

These pieces combine to give users fast load times, instant data access, and reliable notifications.

## 7. Security Measures

- **Authentication**: Firebase Auth ensures only logged-in users can access their data
- **Authorization**: Firestore Security Rules lock down reads/writes so users only see their own documents
- **Encryption**:
  - At rest: Firestore and Firebase Auth data are encrypted by default (AES-256)
  - In transit: All SDK calls use HTTPS/TLS
- **Data Privacy**: We only collect what’s necessary and give users a clear way to delete their data
- **Compliance**: Firebase services are GDPR- and SOC 2–compliant, helping us meet regulatory needs

## 8. Monitoring and Maintenance

- **Firebase Console**: Monitors usage, errors, and performance of Cloud Functions and Firestore
- **Crashlytics**: Tracks app crashes and issues on mobile
- **Analytics Dashboard**: Monitors user engagement metrics (DAU, WAU, streak rates)
- **Logging**: Cloud Functions logs stored in Google Cloud Logging for debugging
- **Maintenance Strategy**:
  - Weekly review of function logs and performance graphs
  - Monthly security rule audits
  - Quarterly dependency updates and testing

## 9. Conclusion and Overall Backend Summary

Our backend is a fully serverless, Firebase-driven platform designed around reliability, speed, and simplicity. By leveraging managed services:

- We avoid the overhead of managing servers or databases
- Users get near-instant data access, both online and offline
- Security and compliance come built in
- We can quickly add custom features (CSV export, reports) via Cloud Functions

This setup aligns with our goals of delivering a minimalist, frictionless experience for Daily Questions Coach users while keeping operational and maintenance costs low. If we outgrow any Firebase component, we can introduce specialized services without reworking the core architecture.

---

With this document, anyone—technical or not—can understand how the Daily Questions Coach backend is built and why each choice was made.