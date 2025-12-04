import React, { useState, useEffect } from "react"
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function HomeScreen() {
  const router = useRouter()
  const [userName, setUserName] = useState("Friend")
  const [lastCheckIn, setLastCheckIn] = useState<string | null>(null)
  const [todayMood, setTodayMood] = useState<string | null>(null)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const name = await AsyncStorage.getItem("userName")
      const checkIn = await AsyncStorage.getItem("lastCheckIn")
      const mood = await AsyncStorage.getItem("todayMood")

      if (name) setUserName(name)
      if (checkIn) setLastCheckIn(checkIn)
      if (mood) setTodayMood(mood)
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  }

  const QuickActionCard = ({
    icon,
    title,
    description,
    colors,
    onPress
  }: any) => (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
      <LinearGradient
        colors={colors}
        style={styles.actionGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name={icon} size={40} color="#fff" />
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionDescription}>{description}</Text>
      </LinearGradient>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.userName}>{userName}!</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push("/profile" as any)}
          >
            <Ionicons name="person-circle" size={50} color="#fff" />
          </TouchableOpacity>
        </View>

        {todayMood && (
          <View style={styles.moodBanner}>
            <Text style={styles.moodText}>
              Today&apos;s Mood: {todayMood === "happy" ? "😊" : todayMood === "sad" ? "😔" : "😐"} {todayMood}
            </Text>
          </View>
        )}
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {!lastCheckIn && (
          <View style={styles.reminderCard}>
            <Ionicons name="chatbubbles" size={30} color="#667eea" />
            <View style={styles.reminderText}>
              <Text style={styles.reminderTitle}>Daily Check-In</Text>
              <Text style={styles.reminderSubtitle}>
                Let&apos;s see how you&apos;re feeling today!
              </Text>
            </View>
            <TouchableOpacity
              style={styles.reminderButton}
              onPress={() => router.push("/(tabs)/chatbot")}
            >
              <Text style={styles.reminderButtonText}>Start</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.actionsGrid}>
          <QuickActionCard
            icon="chatbubbles"
            title="Daily Check"
            description="Share how you feel"
            colors={["#667eea", "#764ba2"]}
            onPress={() => router.push("/(tabs)/chatbot")}
          />

          <QuickActionCard
            icon="fitness"
            title="Exercises"
            description="Stay active & healthy"
            colors={["#f093fb", "#f5576c"]}
            onPress={() => router.push("/(tabs)/activities")}
          />

          <QuickActionCard
            icon="people"
            title="Community"
            description="Connect with friends"
            colors={["#4facfe", "#00f2fe"]}
            onPress={() => router.push("/(tabs)/community")}
          />

          <QuickActionCard
            icon="musical-notes"
            title="Music"
            description="Relax with music"
            colors={["#43e97b", "#38f9d7"]}
            onPress={() => router.push("/music-therapy")}
          />
        </View>

        <Text style={styles.sectionTitle}>Wellness Tips</Text>

        <View style={styles.tipCard}>
          <Ionicons name="water" size={24} color="#4facfe" />
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Stay Hydrated</Text>
            <Text style={styles.tipDescription}>
              Drink at least 8 glasses of water today
            </Text>
          </View>
        </View>

        <View style={styles.tipCard}>
          <Ionicons name="walk" size={24} color="#43e97b" />
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Light Walking</Text>
            <Text style={styles.tipDescription}>
              A short 10-minute walk can boost your mood
            </Text>
          </View>
        </View>

        <View style={styles.tipCard}>
          <Ionicons name="call" size={24} color="#f5576c" />
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Stay Connected</Text>
            <Text style={styles.tipDescription}>
              Call a friend or family member today
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  userName: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
    marginTop: 5,
  },
  profileButton: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  moodBanner: {
    marginTop: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 12,
    borderRadius: 15,
  },
  moodText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  reminderCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  reminderText: {
    flex: 1,
    marginLeft: 15,
  },
  reminderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  reminderSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  reminderButton: {
    backgroundColor: "#667eea",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  reminderButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    marginTop: 10,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  actionCard: {
    width: "48%",
    marginBottom: 15,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  actionGradient: {
    padding: 20,
    alignItems: "center",
    minHeight: 150,
    justifyContent: "center",
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 12,
    textAlign: "center",
  },
  actionDescription: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 5,
    textAlign: "center",
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tipContent: {
    flex: 1,
    marginLeft: 15,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  tipDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
})
