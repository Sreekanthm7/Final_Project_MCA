# Elderly Care App - Setup Guide

## Overview
This is a comprehensive elderly care application with AI-powered mood analysis, therapy recommendations, and community features.

## Features

### 1. **Login & Home Dashboard**
- Beautiful gradient-based UI optimized for elderly users
- Personalized greetings based on time of day
- Quick action cards for easy navigation
- Wellness tips and reminders

### 2. **Daily Check-In Chatbot**
- 10 thoughtful questions to assess daily well-being
- Easy-to-use chat interface with large text
- Stores responses for mood analysis

### 3. **AI Mood Analysis**
- Uses OpenAI GPT-3.5 to analyze user responses
- Identifies emotions and mood patterns
- Provides personalized recommendations

### 4. **For Sad/Depressed Mood:**
- **Music Therapy**: Soothing tracks for relaxation
- **Story Telling**: AI-generated heartwarming stories
- **Community Chat**: Connect with other users

### 5. **For Normal/Happy Mood:**
- **Breathing Exercises**: Guided breathing with visual feedback
- **Gentle Yoga**: Step-by-step yoga poses for seniors

### 6. **Activities Tab**
- Organized wellness activities
- Categorized by wellness, therapy, and social
- Easy navigation to all features

### 7. **Community Tab**
- Real-time chat interface
- Connect with other elderly users
- Reduce loneliness and build friendships

## Installation

### Prerequisites
- Node.js 20.x or higher
- npm or yarn
- Expo CLI
- OpenAI API key

### Steps

1. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Set up OpenAI API Key**
   - Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - Copy \`.env.example\` to \`.env\`
   - Add your API key to the \`.env\` file:
   \`\`\`
   EXPO_PUBLIC_OPENAI_API_KEY=your-actual-api-key-here
   \`\`\`

3. **Run the App**
   \`\`\`bash
   npm start
   \`\`\`

4. **Run on Device**
   - Scan the QR code with Expo Go app (iOS/Android)
   - Or press \`a\` for Android emulator
   - Or press \`i\` for iOS simulator

## UI/UX Design Principles

### Elderly-Friendly Features:
- ✅ **Large Text**: Minimum 16px for readability
- ✅ **High Contrast**: Clear color differentiation
- ✅ **Big Buttons**: Easy to tap (minimum 50px height)
- ✅ **Simple Navigation**: Bottom tabs with clear icons
- ✅ **Minimal Clutter**: Clean, spacious layouts
- ✅ **Visual Feedback**: Clear button states and loading indicators
- ✅ **Smooth Animations**: Gentle transitions, not jarring

### Color Scheme:
- Primary: Purple gradient (#667eea → #764ba2)
- Success/Wellness: Green gradient (#43e97b → #38f9d7)
- Social/Community: Pink gradient (#f093fb → #f5576c)
- Calm/Breathing: Blue gradient (#4facfe → #00f2fe)

## App Flow

1. **User Login** → Home Dashboard
2. **Daily Check-In Prompt** → Chatbot (10 questions)
3. **AI Analysis** → Mood Results Page
4. **Recommendations Based on Mood:**
   - Sad/Lonely → Music, Stories, Community
   - Normal/Happy → Breathing, Yoga
5. **Activities Tab** → All activities organized
6. **Community Tab** → Chat with friends

## Project Structure

\`\`\`
app/
├── (tabs)/
│   ├── index.tsx          # Home Dashboard
│   ├── chatbot.tsx        # Daily Questions
│   ├── activities.tsx     # Activities List
│   └── community.tsx      # Community Chat
├── Login/
│   ├── index.tsx          # Login Screen
│   └── styles.ts          # Login Styles
├── mood-results.tsx       # Analysis Results
├── music-therapy.tsx      # Music Player
├── storytelling.tsx       # AI Stories
├── breathing.tsx          # Breathing Exercise
└── yoga.tsx               # Yoga Poses

services/
└── openai.ts              # OpenAI Integration
\`\`\`

## OpenAI Integration

The app uses OpenAI's GPT-3.5-turbo model for:

1. **Mood Analysis**: Analyzes 10 daily responses to determine emotional state
2. **Story Generation**: Creates heartwarming stories based on themes

### API Calls:
- \`analyzeMood(answers: string[])\`: Returns mood analysis
- \`generateStory(theme: string)\`: Returns AI-generated story

## Customization

### Adding New Questions:
Edit \`DAILY_QUESTIONS\` array in \`app/(tabs)/chatbot.tsx\`

### Adding Music Tracks:
Edit \`MUSIC_TRACKS\` array in \`app/music-therapy.tsx\`

### Adding Yoga Poses:
Edit \`YOGA_POSES\` array in \`app/yoga.tsx\`

### Changing Colors:
Update gradient colors in respective component files

## Future Enhancements

- [ ] Real-time backend for community chat
- [ ] Audio playback for music therapy
- [ ] Video demonstrations for yoga
- [ ] Medication reminders
- [ ] Emergency contact features
- [ ] Health metrics tracking
- [ ] Family member dashboard
- [ ] Voice input for accessibility

## Support

For issues or questions, please create an issue in the repository.

## License

This project is for educational purposes.
