import { CaretakerUser, ElderlyUser } from "../contexts/UserContext"

// Mock elderly users
export const MOCK_ELDERLY_USERS: ElderlyUser[] = [
  {
    id: "1",
    name: "Margaret Thompson",
    age: 78,
    lastActive: "2 hours ago",
    currentMood: "happy",
    healthStatus: "good",
    recentActivities: ["Breathing Exercise", "Story Time", "Community Chat"],
    moodHistory: [
      { date: "2025-12-03", mood: "happy", notes: "Enjoyed story time today" },
      { date: "2025-12-02", mood: "happy", notes: "Good day overall" },
      { date: "2025-12-01", mood: "neutral", notes: "Quiet day at home" },
      { date: "2025-11-30", mood: "happy", notes: "Family visited" },
      { date: "2025-11-29", mood: "sad", notes: "Missing old friends" },
    ],
    vitalSigns: {
      heartRate: 72,
      bloodPressure: "120/80",
      temperature: 98.6,
    },
  },
  {
    id: "2",
    name: "Robert Wilson",
    age: 82,
    lastActive: "5 hours ago",
    currentMood: "neutral",
    healthStatus: "fair",
    recentActivities: ["Gentle Yoga", "Music Therapy"],
    moodHistory: [
      { date: "2025-12-03", mood: "neutral", notes: "Regular day" },
      { date: "2025-12-02", mood: "sad", notes: "Not feeling well" },
      { date: "2025-12-01", mood: "neutral", notes: "Resting day" },
      { date: "2025-11-30", mood: "happy", notes: "Enjoyed music therapy" },
      { date: "2025-11-29", mood: "neutral", notes: "Routine activities" },
    ],
    vitalSigns: {
      heartRate: 78,
      bloodPressure: "130/85",
      temperature: 98.4,
    },
  },
  {
    id: "3",
    name: "Dorothy Martinez",
    age: 75,
    lastActive: "1 day ago",
    currentMood: "sad",
    healthStatus: "needs-attention",
    recentActivities: ["Breathing Exercise"],
    moodHistory: [
      { date: "2025-12-02", mood: "sad", notes: "Feeling lonely" },
      { date: "2025-12-01", mood: "sad", notes: "Missing family" },
      { date: "2025-11-30", mood: "neutral", notes: "Quiet day" },
      { date: "2025-11-29", mood: "neutral", notes: "Regular activities" },
      { date: "2025-11-28", mood: "happy", notes: "Video call with grandchildren" },
    ],
    vitalSigns: {
      heartRate: 85,
      bloodPressure: "140/90",
      temperature: 99.1,
    },
  },
  {
    id: "4",
    name: "James Anderson",
    age: 80,
    lastActive: "30 minutes ago",
    currentMood: "happy",
    healthStatus: "good",
    recentActivities: [
      "Gentle Yoga",
      "Story Time",
      "Breathing Exercise",
      "Community Chat",
    ],
    moodHistory: [
      { date: "2025-12-03", mood: "happy", notes: "Very active today" },
      { date: "2025-12-02", mood: "happy", notes: "Great yoga session" },
      { date: "2025-12-01", mood: "happy", notes: "Connected with friends" },
      { date: "2025-11-30", mood: "neutral", notes: "Regular day" },
      { date: "2025-11-29", mood: "happy", notes: "Feeling energetic" },
    ],
    vitalSigns: {
      heartRate: 68,
      bloodPressure: "118/78",
      temperature: 98.5,
    },
  },
  {
    id: "5",
    name: "Elizabeth Davis",
    age: 76,
    lastActive: "3 hours ago",
    currentMood: "neutral",
    healthStatus: "good",
    recentActivities: ["Music Therapy", "Community Chat"],
    moodHistory: [
      { date: "2025-12-03", mood: "neutral", notes: "Calm day" },
      { date: "2025-12-02", mood: "happy", notes: "Enjoyed music" },
      { date: "2025-12-01", mood: "neutral", notes: "Normal activities" },
      { date: "2025-11-30", mood: "happy", notes: "Good conversation with friends" },
      { date: "2025-11-29", mood: "neutral", notes: "Peaceful day" },
    ],
    vitalSigns: {
      heartRate: 70,
      bloodPressure: "122/82",
      temperature: 98.7,
    },
  },
]

// Mock caretaker user
export const MOCK_CARETAKER: CaretakerUser = {
  id: "ct1",
  name: "Sarah Johnson",
  email: "sarah.johnson@care.com",
  elderlyUsers: MOCK_ELDERLY_USERS,
}
