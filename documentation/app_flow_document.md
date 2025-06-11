# App Flow Document

## Onboarding and Sign-In/Sign-Up

When a brand-new user opens the Daily Questions Coach app for the first time, they are greeted by a clean, branded splash screen that quickly transitions to the sign-up screen. On this screen, the user can choose to create an account by signing in with Google, signing in with Apple (on iOS), or by entering an email address and password. If they select the email option, they enter their email and choose a secure password before tapping the Create Account button. If they choose Google or Apple, the app launches the respective authentication flow and returns them to the app once the login succeeds. After account creation, the user sees a brief privacy notice explaining that all data is stored locally on the device and an invitation to set their daily reminder time.

If an existing user needs to sign in again, they tap the Sign In link on the splash screen, enter their email and password or choose Google or Apple sign-in, and then return to their main dashboard. If they have forgotten their password, they tap the Forgot Password link, enter their email address, and receive an on-device prompt to reset their password. Once they follow the instructions, they return to the sign-in screen to enter their new credentials. To sign out, the user navigates to the Settings screen and taps Sign Out, which clears their session and brings them back to the initial sign-in screen.

## Main Dashboard or Home Page

After signing in, the user lands on the main dashboard, which shows today’s date prominently at the top and displays the full list of their active reflection questions in a single, scrollable view. Each question appears with a control that matches its response type, such as a toggle for yes/no questions or a text field for short answers. A small indicator next to the date shows if today’s questions have been completed. At the bottom of the screen, a simple navigation bar provides icons for Dashboard, Progress, and Settings, allowing the user to switch between these core areas at any time. The design remains uncluttered, with plenty of white space and large touch targets to ensure answering questions feels quick and intuitive.

## Detailed Feature Flows and Page Transitions

### Daily Reflection Flow and Answer Submission

Each day, when the user opens the app or taps the push notification reminder, they are taken directly to the dashboard for today’s reflection questions. As they tap through each question, their response is saved immediately to local storage. If they choose to skip a question, it remains unfilled but is marked as skipped internally. Once they have provided answers for all questions or skipped any they prefer not to answer, a semi-transparent overlay slides up from the bottom. This overlay congratulates them with a cheerful "Well done!" message and shows their current streak of consecutive days answered. A light animation of confetti reinforces the sense of achievement. When the user taps anywhere on the screen, the overlay dismisses and they return to the main dashboard, where the date indicator now displays a green checkmark to confirm completion.

### Progress Tracking and Insights

From the dashboard, the user can swipe left or tap the Progress icon in the bottom navigation bar to access the Insights page. This page opens with a banner at the top displaying the current streak and the longest streak ever achieved. Below this banner, a calendar view highlights answered days in one color and missed days in another, giving the user a quick visual of their consistency over the past month. Scrolling further down reveals a simple trend chart that plots the percentage of questions answered each day or the numeric values entered for certain questions. Transitions between the calendar and chart animate smoothly, helping the user feel engaged without feeling overwhelmed.

### Question Management and Customization

The user can manage their questions by tapping the Settings icon and then choosing Manage Questions. On the Question Management screen, they see a list of both default and custom questions. Tapping any question opens an edit screen where they can change the text, switch the response type between yes/no, numeric value, or short text, or choose to archive or delete the question. Archiving a question removes it from the daily list but retains all past answers for reporting. Deleting a question permanently removes it and all its associated data. To add a new question, the user taps the Add Question button, enters the prompt, selects the response format, and taps Save. If the user reaches the maximum of twenty custom questions, the app displays a gentle notification explaining that no more custom questions can be added until one is archived or deleted.

### Reminders and Notifications Flow

In Settings, the user can tap on Notifications to adjust their daily reminder time or turn reminders off entirely. If they change the time, the app confirms the new schedule with an in-app message that quickly fades away. When it is time for the daily reminder, the operating system delivers a push notification that reads, “Time for your Daily Questions.” Tapping the notification opens the app directly to the dashboard for that day’s questions. If the user swipes to snooze or dismisses the notification, the operating system handles it according to its native controls without additional prompts from the app.

## Settings and Account Management

The Settings area is accessible via the bottom navigation bar. Here, users find sections for Profile, Notifications, Question Management, and Export Data. In the Profile section, they can update their display name, change their email or password (for email-based accounts), or view their authentication method (Google or Apple). They can also delete their account, which triggers a confirmation dialog reminding them that all locally stored data will be erased. When confirmed, the app clears the encrypted data store and returns the user to the sign-in screen. In the Export Data section, the user can request a CSV export of all their answers. Tapping the Export button opens the device’s native share sheet, allowing the user to save the file locally or share it through other apps.

## Error States and Alternate Paths

If the user enters an invalid email or password during sign-up or sign-in, the app displays a clear, red-tinted message explaining the error and inviting them to try again. If the network is unavailable during OAuth sign-in, the user sees a notification that they should check their connection and try again later. While answering questions offline, all responses are queued and saved locally; if syncing becomes necessary later, the app handles it automatically without user intervention. When the user attempts to add more than twenty custom questions, a gentle notice explains the limit. If they try to delete a question by mistake, a confirmation dialog appears to prevent accidental loss of data. Push notification failures are logged internally, and the app retries delivery on the next scheduled reminder.

## Conclusion and Overall App Journey

From the moment a user launches the app and signs up, they experience a smooth, guided introduction that sets up their reminder time and initial questions in just a few taps. Each day, they open the dashboard or tap a friendly notification to answer their questions, enjoying instant feedback and subtle celebrations for keeping their streak alive. They can track their progress with simple calendars and charts, tweak their questions to match evolving goals, and manage reminders or account details whenever they need. If anything goes wrong—whether it is entering the wrong password, hitting a question limit, or losing connectivity—the app provides clear guidance and recovers gracefully. This flow ensures that users stay focused on their self-reflection, building consistency and motivation one daily question at a time.
