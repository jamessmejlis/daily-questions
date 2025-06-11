# Daily Questions Coach

A beautiful, minimalist mobile app for personal accountability and self-reflection. Track your daily progress with customizable questions, build streaks, and stay motivated on your self-improvement journey.

## Features

- 📝 **Customizable Questions**: Create up to 20 personal reflection questions
- 🎯 **Daily Tracking**: Answer questions with toggles, numbers, or text
- 🔥 **Streak Tracking**: Build and maintain daily habits
- 📊 **Progress Insights**: Visual calendar and completion statistics
- 🔒 **Privacy First**: All data stored locally on your device
- 🌙 **Dark Mode**: Automatic light/dark theme support
- 📱 **Mobile Optimized**: Beautiful, responsive design for all screen sizes

## Tech Stack

- **Framework**: Expo SDK 53 + React Native
- **Language**: TypeScript
- **Navigation**: Expo Router with tab-based navigation
- **Database**: SQLite with Expo SQLite
- **Storage**: Expo SecureStore for sensitive data
- **Styling**: React Native StyleSheet with custom design system
- **Icons**: Lucide React Native
- **Fonts**: Inter font family via Expo Google Fonts

## Getting Started

### Prerequisites

- Node.js 18+ 
- Expo CLI
- iOS Simulator or Android Emulator (or Expo Go app)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd daily-questions-coach
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app

## Project Structure

```
daily-questions-coach/
├── app/                    # Expo Router pages
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main tab navigation
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
│   └── ui/               # Base UI components
├── contexts/             # React Context providers
├── services/             # Data services and database
├── constants/            # Colors, spacing, typography
├── hooks/                # Custom React hooks
└── types/                # TypeScript type definitions
```

## Key Features

### Authentication
- Local email/password authentication
- Secure credential storage
- Account management and deletion

### Question Management
- Create, edit, archive, and delete questions
- Three question types: toggle (yes/no), numeric, and text
- Drag-and-drop reordering (coming soon)

### Daily Reflection
- Clean, distraction-free interface
- Auto-save functionality
- Skip questions option
- Completion celebration with streak display

### Progress Tracking
- Calendar heatmap showing completion rates
- Current and longest streak tracking
- Weekly and monthly averages
- Insightful progress analytics

### Settings & Privacy
- Notification preferences
- Data export (coming soon)
- Complete data privacy - everything stays on device
- Account deletion with data cleanup

## Design System

The app uses a carefully crafted design system with:

- **Colors**: Primary indigo, secondary green, with full light/dark mode support
- **Typography**: Inter font family with consistent sizing scale
- **Spacing**: 8px grid system for consistent layouts
- **Components**: Reusable UI components following accessibility guidelines

## Privacy & Security

- **Local Storage**: All data stored on device using encrypted SQLite
- **No Cloud Sync**: Your reflections never leave your device
- **Secure Authentication**: Credentials stored using Expo SecureStore
- **Data Ownership**: Complete control over your data with export/delete options

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Inspired by Marshall Goldsmith's Daily Questions method
- Built with love for the self-improvement community
- Designed for privacy, simplicity, and effectiveness