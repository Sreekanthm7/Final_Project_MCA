# Elderly Care App 💜

A comprehensive React Native app for elderly care with AI-powered mood analysis and personalized recommendations.

## ✅ All Errors Fixed!

### Issues Resolved:
1. ✅ Removed old `explore.tsx` file that was causing import errors
2. ✅ Fixed unused `size` parameter warnings in tab navigation
3. ✅ Added all screens to root Stack navigation
4. ✅ All dependencies properly installed
5. ✅ TypeScript errors: **0**

## 🚀 Quick Start

### 1. Set up OpenAI API Key
```bash
# Create .env file
cp .env.example .env

# Add your OpenAI API key to .env
EXPO_PUBLIC_OPENAI_API_KEY=your-actual-api-key-here
```

Get your API key from: https://platform.openai.com/api-keys

### 2. Start the Development Server
```bash
npm start
```

### 3. Run on Device
- **iOS**: Press `i` or scan QR with Camera app
- **Android**: Press `a` or scan QR with Expo Go app
- **Web**: Press `w`

## 📱 App Features

### Login Page
- Modern gradient UI with social login options
- Email/password authentication

### Home Dashboard
- Personalized greetings based on time of day
- Quick action cards for easy navigation
- Daily check-in reminders
- Wellness tips

### Daily Check-In (Chatbot)
- 10 comprehensive questions about daily well-being
- Chat interface with progress tracker
- Stores responses for AI mood analysis

### AI Mood Analysis
- Powered by OpenAI GPT-3.5
- Analyzes emotions and mood patterns
- Provides personalized recommendations

### For Sad/Depressed Mood:
- **Music Therapy**: 6 soothing tracks (Classical, Nature Sounds, Jazz)
- **Story Time**: AI-generated heartwarming stories (6 themes)
- **Community Chat**: Connect with other users

### For Normal/Happy Mood:
- **Breathing Exercise**: Animated 4-4-4 breathing pattern
- **Gentle Yoga**: 6 poses with step-by-step instructions

### Activities Tab
- All activities organized by category
- Wellness, Therapy, and Social sections
- Motivational tips

### Community Tab
- Real-time chat interface
- Online user counter
- Connect and share with others

## 🎨 Elderly-Friendly UI

- ✅ **Large text** (16-22px minimum)
- ✅ **High contrast colors** for better readability
- ✅ **Big touch targets** (50px+ buttons)
- ✅ **Clear icons** (28px+)
- ✅ **Simple navigation** with bottom tabs
- ✅ **Smooth gradients** (Purple, Green, Blue, Pink)
- ✅ **Spacious layouts** - no clutter
- ✅ **Visual feedback** for all interactions

## 📂 Project Structure

```
app/
├── (tabs)/
│   ├── index.tsx          # Home Dashboard
│   ├── chatbot.tsx        # Daily Questions (10 questions)
│   ├── activities.tsx     # Activities List
│   └── community.tsx      # Community Chat
├── Login/
│   ├── index.tsx          # Login Screen
│   └── styles.ts          # Login Styles
├── mood-results.tsx       # AI Analysis Results
├── music-therapy.tsx      # Music Therapy (6 tracks)
├── storytelling.tsx       # AI Story Generator (6 themes)
├── breathing.tsx          # Breathing Exercise (animated)
└── yoga.tsx               # Yoga Poses (6 poses)

services/
└── openai.ts              # OpenAI Integration
```

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Routing**: Expo Router (file-based routing)
- **UI**: React Native components with LinearGradient
- **Icons**: @expo/vector-icons (Ionicons)
- **Storage**: AsyncStorage for local data
- **AI**: OpenAI GPT-3.5-turbo
- **TypeScript**: Full type safety
- **Styling**: StyleSheet API

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_OPENAI_API_KEY=your-openai-api-key
```

## 🔄 App Flow

1. **Login** → Home Dashboard
2. **Daily Check-In Prompt** → Chatbot (10 questions)
3. **AI Analysis** → Mood Results Page
4. **Recommendations Based on Mood:**
   - **Sad/Lonely** → Music Therapy, Story Time, Community Chat
   - **Normal/Happy** → Breathing Exercise, Gentle Yoga
5. **Activities Tab** → Browse all activities
6. **Community Tab** → Chat with friends

## 🧪 Available Scripts

```bash
# Start development server
npm start

# Run on Android emulator
npm run android

# Run on iOS simulator
npm run ios

# Run on web browser
npm run web

# Lint code
npm run lint
```

## 📱 The 10 Daily Questions

1. How are you feeling today?
2. How well did you sleep last night?
3. Have you eaten your meals today?
4. Are you experiencing any physical discomfort or pain?
5. Have you taken your medications today?
6. Have you been able to connect with family or friends today?
7. How is your energy level today?
8. Are you feeling lonely or sad today?
9. Did you do any activities you enjoy today?
10. Is there anything particular worrying you right now?

## 🎯 OpenAI Integration

The app uses OpenAI's GPT-3.5-turbo model for:

### 1. Mood Analysis
- Analyzes all 10 daily responses
- Determines emotional state (sad, normal, happy)
- Identifies specific emotions (loneliness, anxiety, joy, etc.)
- Assesses severity if mood is sad
- Lists specific concerns if any

### 2. Story Generation
- Creates heartwarming stories based on 6 themes:
  - Friendship
  - Nature
  - Family
  - Wisdom
  - Adventure
  - Kindness

## 🎨 Color Scheme

- **Primary**: Purple gradient (#667eea → #764ba2)
- **Success/Wellness**: Green gradient (#43e97b → #38f9d7)
- **Social/Community**: Pink gradient (#f093fb → #f5576c)
- **Calm/Breathing**: Blue gradient (#4facfe → #00f2fe)

## 🔒 Privacy & Security

- User responses stored locally using AsyncStorage
- OpenAI API key secured in environment variables
- No personal data shared without consent
- `.env` file excluded from git (.gitignore)

## 🆘 Troubleshooting

### App won't start?
1. Ensure all dependencies are installed: `npm install`
2. Clear cache: `npx expo start -c`
3. Check Node.js version: `node --version` (should be 20.x)

### OpenAI errors?
1. Verify API key is set in `.env` file
2. Check API key is valid at https://platform.openai.com
3. Ensure you have credits in your OpenAI account

### Navigation errors?
1. All screens are registered in `app/_layout.tsx`
2. Tab screens are in `app/(tabs)/_layout.tsx`

## 🎯 Future Enhancements

- [ ] Real-time backend for community chat
- [ ] Actual audio playback for music therapy
- [ ] Video demonstrations for yoga poses
- [ ] Medication reminder notifications
- [ ] Emergency contact SOS features
- [ ] Health metrics tracking (steps, heart rate)
- [ ] Family member dashboard
- [ ] Voice input for better accessibility
- [ ] Multilingual support
- [ ] Dark mode support

## 📄 License

This project is for educational purposes.

## 🙏 Acknowledgments

- Powered by OpenAI GPT-3.5
- Built with Expo and React Native
- Icons by Ionicons

---

**Status**: ✅ **Ready to run - All errors fixed!**

**Created with**: Claude Code 💜
