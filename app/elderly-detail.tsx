import React, { useState, useEffect } from "react"
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useLocalSearchParams, useRouter } from "expo-router"
import { ElderlyUser } from "../contexts/UserContext"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { API_CONFIG } from "../api/config"

export default function ElderlyDetailScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const [elderlyUser, setElderlyUser] = useState<ElderlyUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchElderlyUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.userId])

  const fetchElderlyUser = async () => {
    try {
      setIsLoading(true)
      const token = await AsyncStorage.getItem("authToken")

      if (!token) {
        Alert.alert("Error", "Not authenticated")
        router.back()
        return
      }

      console.log("Fetching elderly user:", params.userId)

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/users/${params.userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()
      console.log("Elderly user data:", data)

      if (response.ok && data.success) {
        const user = data.data.user
        setElderlyUser({
          id: user._id || user.id,
          name: user.name,
          age: user.age,
          healthStatus: user.healthStatus || "good",
          currentMood: user.currentMood || "neutral",
          lastActive: getLastActiveString(user.lastActive),
          recentActivities: user.recentActivities || [],
          moodHistory: user.moodHistory || [],
          vitalSigns: user.vitalSigns,
        })
      } else {
        Alert.alert("Error", data.message || "Failed to load user data")
        router.back()
      }
    } catch (error) {
      console.error("Fetch elderly user error:", error)
      Alert.alert("Error", "Failed to load user data")
      router.back()
    } finally {
      setIsLoading(false)
    }
  }

  const getLastActiveString = (lastActiveDate: any) => {
    if (!lastActiveDate) {
      return "Never"
    }

    const now = new Date()
    const lastActive = new Date(lastActiveDate)
    const diffInMs = now.getTime() - lastActive.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInMinutes < 1) {
      return "Just now"
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
    } else {
      return lastActive.toLocaleDateString()
    }
  }

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#43e97b" />
        <Text style={styles.loadingText}>Loading user details...</Text>
      </View>
    )
  }

  if (!elderlyUser) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Ionicons name="alert-circle" size={60} color="#999" />
        <Text style={styles.errorText}>User not found</Text>
        <TouchableOpacity
          style={styles.backToListButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backToListText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const getMoodColor = (mood?: "happy" | "sad" | "neutral") => {
    switch (mood) {
      case "happy":
        return ["#43e97b", "#38f9d7"] as const
      case "sad":
        return ["#f5576c", "#f093fb"] as const
      case "neutral":
        return ["#4facfe", "#00f2fe"] as const
      default:
        return ["#999", "#666"] as const
    }
  }

  const getMoodIcon = (mood?: "happy" | "sad" | "neutral") => {
    switch (mood) {
      case "happy":
        return "happy"
      case "sad":
        return "sad"
      case "neutral":
        return "remove-circle"
      default:
        return "help-circle"
    }
  }

  const getHealthStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return "checkmark-circle"
      case "fair":
        return "alert-circle"
      case "needs-attention":
        return "warning"
      default:
        return "help-circle"
    }
  }

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "#43e97b"
      case "fair":
        return "#fee140"
      case "needs-attention":
        return "#f5576c"
      default:
        return "#999"
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={getMoodColor(elderlyUser.currentMood)}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>User Details</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.profileSection}>
          <View style={styles.avatarLarge}>
            <Ionicons name="person" size={60} color="#fff" />
          </View>
          <Text style={styles.profileName}>{elderlyUser.name}</Text>
          <Text style={styles.profileAge}>{elderlyUser.age} years old</Text>
          <View style={styles.lastActiveContainer}>
            <Ionicons name="time" size={16} color="rgba(255,255,255,0.9)" />
            <Text style={styles.lastActive}>Last active: {elderlyUser.lastActive}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Status</Text>

          <View style={styles.statusGrid}>
            <View style={styles.statusCard}>
              <Ionicons
                name={getMoodIcon(elderlyUser.currentMood)}
                size={40}
                color={getMoodColor(elderlyUser.currentMood)[0]}
              />
              <Text style={styles.statusLabel}>Mood</Text>
              <Text style={styles.statusValue}>
                {elderlyUser.currentMood || "Unknown"}
              </Text>
            </View>

            <View style={styles.statusCard}>
              <Ionicons
                name={getHealthStatusIcon(elderlyUser.healthStatus)}
                size={40}
                color={getHealthStatusColor(elderlyUser.healthStatus)}
              />
              <Text style={styles.statusLabel}>Health</Text>
              <Text style={styles.statusValue}>
                {elderlyUser.healthStatus === "needs-attention"
                  ? "Needs Care"
                  : elderlyUser.healthStatus}
              </Text>
            </View>
          </View>
        </View>

        {/* Vital Signs */}
        {elderlyUser.vitalSigns && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vital Signs</Text>
            <View style={styles.vitalSignsCard}>
              <View style={styles.vitalSignRow}>
                <View style={styles.vitalSignItem}>
                  <Ionicons name="heart" size={24} color="#f5576c" />
                  <View style={styles.vitalSignInfo}>
                    <Text style={styles.vitalSignLabel}>Heart Rate</Text>
                    <Text style={styles.vitalSignValue}>
                      {elderlyUser.vitalSigns.heartRate || "N/A"} bpm
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.vitalSignRow}>
                <View style={styles.vitalSignItem}>
                  <Ionicons name="pulse" size={24} color="#667eea" />
                  <View style={styles.vitalSignInfo}>
                    <Text style={styles.vitalSignLabel}>Blood Pressure</Text>
                    <Text style={styles.vitalSignValue}>
                      {elderlyUser.vitalSigns.bloodPressure || "N/A"} mmHg
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.vitalSignRow}>
                <View style={styles.vitalSignItem}>
                  <Ionicons name="thermometer" size={24} color="#43e97b" />
                  <View style={styles.vitalSignInfo}>
                    <Text style={styles.vitalSignLabel}>Temperature</Text>
                    <Text style={styles.vitalSignValue}>
                      {elderlyUser.vitalSigns.temperature || "N/A"}°F
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Recent Activities */}
        {elderlyUser.recentActivities && elderlyUser.recentActivities.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Activities</Text>
            <View style={styles.activitiesCard}>
              {elderlyUser.recentActivities.map((activity, index) => (
                <View key={index}>
                  <View style={styles.activityItem}>
                    <Ionicons name="checkmark-circle" size={20} color="#43e97b" />
                    <Text style={styles.activityText}>{activity}</Text>
                  </View>
                  {index < elderlyUser.recentActivities.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Mood History */}
        {elderlyUser.moodHistory && elderlyUser.moodHistory.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mood History (Last 5 Days)</Text>
            <View style={styles.moodHistoryCard}>
              {elderlyUser.moodHistory.map((entry, index) => (
                <View key={index}>
                  <View style={styles.moodHistoryItem}>
                    <View style={styles.moodHistoryLeft}>
                      <Ionicons
                        name={getMoodIcon(entry.mood)}
                        size={28}
                        color={getMoodColor(entry.mood)[0]}
                      />
                      <View style={styles.moodHistoryInfo}>
                        <Text style={styles.moodHistoryDate}>{entry.date}</Text>
                        <Text style={styles.moodHistoryMood}>
                          {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
                        </Text>
                        {entry.notes && (
                          <Text style={styles.moodHistoryNotes}>{entry.notes}</Text>
                        )}
                      </View>
                    </View>
                  </View>
                  {index < elderlyUser.moodHistory.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton}>
            <LinearGradient
              colors={["#667eea", "#764ba2"] as const}
              style={styles.actionButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="call" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Call User</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <LinearGradient
              colors={["#43e97b", "#38f9d7"] as const}
              style={styles.actionButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="chatbubbles" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Send Message</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
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
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  profileSection: {
    alignItems: "center",
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  profileName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  profileAge: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 10,
  },
  lastActiveContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  lastActive: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  statusGrid: {
    flexDirection: "row",
    gap: 15,
  },
  statusCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
    textTransform: "capitalize",
  },
  vitalSignsCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  vitalSignRow: {
    paddingVertical: 5,
  },
  vitalSignItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  vitalSignInfo: {
    flex: 1,
  },
  vitalSignLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  vitalSignValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 15,
  },
  activitiesCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 5,
  },
  activityText: {
    fontSize: 16,
    color: "#333",
  },
  moodHistoryCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  moodHistoryItem: {
    paddingVertical: 5,
  },
  moodHistoryLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 15,
  },
  moodHistoryInfo: {
    flex: 1,
  },
  moodHistoryDate: {
    fontSize: 14,
    color: "#999",
    marginBottom: 4,
  },
  moodHistoryMood: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  moodHistoryNotes: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  actionsSection: {
    marginTop: 25,
    gap: 15,
  },
  actionButton: {
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  actionButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    gap: 10,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    marginTop: 15,
    fontSize: 18,
    color: "#999",
    marginBottom: 20,
  },
  backToListButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    backgroundColor: "#43e97b",
    borderRadius: 25,
  },
  backToListText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})
