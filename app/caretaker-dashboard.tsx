import React, { useState, useEffect } from "react"
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { useUser, ElderlyUser } from "../contexts/UserContext"
import { fetchCaretakerDashboard } from "../api/caretaker"

export default function CaretakerDashboard() {
  const router = useRouter()
  const { currentUser, logout } = useUser()
  const [searchQuery, setSearchQuery] = useState("")
  const [elderlyUsers, setElderlyUsers] = useState<ElderlyUser[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)

      console.log("Fetching caretaker dashboard data...")
      const result = await fetchCaretakerDashboard()
      console.log("Dashboard result:", JSON.stringify(result, null, 2))

      if (result.success && result.data) {
        console.log("Elderly users found:", result.data.elderlyUsers?.length || 0)
        setElderlyUsers(result.data.elderlyUsers || [])
      } else {
        console.error("Dashboard error:", result.error)
        Alert.alert("Error", result.error || "Failed to load dashboard data")
      }
    } catch (err) {
      console.error("Dashboard exception:", err)
      const errorMsg = err instanceof Error ? err.message : "An error occurred"
      Alert.alert("Error", errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout()
            router.replace("/Login" as any)
          }
        }
      ]
    )
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

  const getMoodColor = (mood?: "happy" | "sad" | "neutral") => {
    switch (mood) {
      case "happy":
        return "#43e97b"
      case "sad":
        return "#f5576c"
      case "neutral":
        return "#4facfe"
      default:
        return "#999"
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

  const filteredUsers = elderlyUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatistics = () => {
    return {
      total: elderlyUsers.length,
      good: elderlyUsers.filter((u) => u.healthStatus === "good").length,
      needsAttention: elderlyUsers.filter((u) => u.healthStatus === "needs-attention").length,
      activeToday: elderlyUsers.filter((u) => u.lastActive.includes("hours") || u.lastActive.includes("minutes")).length,
    }
  }

  const stats = getStatistics()

  // Show loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#43e97b" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#43e97b", "#38f9d7"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.caretakerName}>{currentUser?.name || "Caretaker"}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.good}</Text>
            <Text style={styles.statLabel}>Healthy</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.needsAttention}</Text>
            <Text style={styles.statLabel}>Need Attention</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.activeToday}</Text>
            <Text style={styles.statLabel}>Active Today</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search elderly users..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.sectionTitle}>
          Elderly Users ({filteredUsers.length})
        </Text>

        <ScrollView
          style={styles.usersList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.usersListContent}
        >
          {filteredUsers.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="people" size={60} color="#ccc" />
              <Text style={styles.emptyStateText}>
                {searchQuery ? "No users found" : "No users assigned yet"}
              </Text>
            </View>
          ) : (
            filteredUsers.map((user: ElderlyUser) => (
              <TouchableOpacity
                key={user.id}
                style={styles.userCard}
                onPress={() =>
                  router.push({
                    pathname: "/elderly-detail" as any,
                    params: { userId: user.id },
                  })
                }
                activeOpacity={0.7}
              >
                <View style={styles.userCardLeft}>
                  <View style={styles.avatarContainer}>
                    <Ionicons name="person" size={32} color="#667eea" />
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userAge}>{user.age} years old</Text>
                    <View style={styles.userMeta}>
                      <Ionicons name="time" size={12} color="#999" />
                      <Text style={styles.lastActive}>{user.lastActive}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.userCardRight}>
                  <View style={styles.statusBadge}>
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: getHealthStatusColor(user.healthStatus) },
                      ]}
                    />
                    <Text style={styles.statusText}>
                      {user.healthStatus === "needs-attention"
                        ? "Needs Attention"
                        : user.healthStatus}
                    </Text>
                  </View>

                  <View style={styles.moodContainer}>
                    <Ionicons
                      name={getMoodIcon(user.currentMood)}
                      size={24}
                      color={getMoodColor(user.currentMood)}
                    />
                  </View>

                  <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </View>
              </TouchableOpacity>
            ))
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
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
    marginBottom: 25,
  },
  greeting: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
  },
  caretakerName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 11,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  usersList: {
    flex: 1,
  },
  usersListContent: {
    paddingBottom: 20,
  },
  userCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  userAge: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  userMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  lastActive: {
    fontSize: 12,
    color: "#999",
  },
  userCardRight: {
    alignItems: "flex-end",
    gap: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    color: "#666",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  moodContainer: {
    marginRight: 8,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#999",
    marginTop: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#666",
  },
})
