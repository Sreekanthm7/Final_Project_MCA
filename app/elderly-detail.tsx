import React, { useState, useEffect } from "react"
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useLocalSearchParams, useRouter } from "expo-router"
import { ElderlyUser } from "../contexts/UserContext"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { API_CONFIG } from "../api/config"

interface MoodDataPoint {
  date: string
  mood: string | null
  moodScore: number | null
  emotions: string[]
  concerns: string[]
}

interface MoodSummary {
  totalEntries: number
  averageScore: number
  moodCounts: { happy: number; sad: number; neutral: number }
  predominantMood: string
}

interface MoodHistoryData {
  period: string
  entries: MoodDataPoint[]
  summary: MoodSummary
}

const SCREEN_WIDTH = Dimensions.get("window").width

export default function ElderlyDetailScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const [elderlyUser, setElderlyUser] = useState<ElderlyUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<"weekly" | "monthly">(
    "weekly"
  )
  const [moodHistory, setMoodHistory] = useState<MoodHistoryData | null>(null)
  const [isMoodLoading, setIsMoodLoading] = useState(false)

  useEffect(() => {
    fetchElderlyUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.userId])

  useEffect(() => {
    if (params.userId) {
      fetchMoodHistory(selectedPeriod)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.userId, selectedPeriod])

  const fetchElderlyUser = async () => {
    try {
      setIsLoading(true)
      const token = await AsyncStorage.getItem("authToken")

      if (!token) {
        Alert.alert("Error", "Not authenticated")
        router.back()
        return
      }

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

  const fetchMoodHistory = async (period: "weekly" | "monthly") => {
    try {
      setIsMoodLoading(true)
      const token = await AsyncStorage.getItem("authToken")

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/mood/history/${params.userId}?period=${period}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (response.ok && data.success) {
        setMoodHistory(data.data)
      }
    } catch (error) {
      console.error("Error fetching mood history:", error)
    } finally {
      setIsMoodLoading(false)
    }
  }

  const getLastActiveString = (lastActiveDate: any) => {
    if (!lastActiveDate) return "Never"

    const now = new Date()
    const lastActive = new Date(lastActiveDate)
    const diffInMs = now.getTime() - lastActive.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60)
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
    if (diffInDays < 7)
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
    return lastActive.toLocaleDateString()
  }

  const getMoodColor = (mood?: "happy" | "sad" | "neutral" | string) => {
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

  const getMoodIcon = (mood?: "happy" | "sad" | "neutral" | string) => {
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

  const getBarColor = (mood: string | null) => {
    switch (mood) {
      case "happy":
        return "#43e97b"
      case "sad":
        return "#f5576c"
      case "neutral":
        return "#4facfe"
      default:
        return "#e0e0e0"
    }
  }

  const getScoreBarColor = (score: number | null) => {
    if (!score) return "#e0e0e0"
    if (score >= 7) return "#43e97b"
    if (score >= 4) return "#4facfe"
    return "#f5576c"
  }

  const formatDateLabel = (dateStr: string, period: string) => {
    const date = new Date(dateStr)
    if (period === "monthly") {
      return `${date.getDate()}/${date.getMonth() + 1}`
    }
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    return days[date.getDay()]
  }

  const renderMoodBarChart = () => {
    if (!moodHistory || moodHistory.entries.length === 0) {
      return (
        <View style={styles.emptyChart}>
          <Ionicons name="analytics-outline" size={48} color="#ccc" />
          <Text style={styles.emptyChartText}>
            No mood data available yet
          </Text>
        </View>
      )
    }

    const entries = moodHistory.entries
    const chartWidth = SCREEN_WIDTH - 80
    const barWidth =
      selectedPeriod === "weekly"
        ? Math.min(30, chartWidth / entries.length - 8)
        : Math.min(14, chartWidth / entries.length - 2)
    const maxBarHeight = 120

    return (
      <View>
        {/* Score Chart */}
        <Text style={styles.chartSubTitle}>Mood Score Trend</Text>
        <View style={styles.chartContainer}>
          <View style={styles.yAxisLabels}>
            <Text style={styles.yLabel}>10</Text>
            <Text style={styles.yLabel}>5</Text>
            <Text style={styles.yLabel}>0</Text>
          </View>
          <View style={styles.chartArea}>
            {/* Grid lines */}
            <View style={[styles.gridLine, { bottom: maxBarHeight }]} />
            <View style={[styles.gridLine, { bottom: maxBarHeight / 2 }]} />
            <View style={[styles.gridLine, { bottom: 0 }]} />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.barsContainer}
            >
              {entries.map((entry, index) => {
                const barHeight = entry.moodScore
                  ? (entry.moodScore / 10) * maxBarHeight
                  : 4
                return (
                  <View key={index} style={styles.barWrapper}>
                    <View
                      style={{
                        height: maxBarHeight,
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}
                    >
                      {entry.moodScore && (
                        <Text style={styles.barValue}>{entry.moodScore}</Text>
                      )}
                      <View
                        style={[
                          styles.bar,
                          {
                            height: barHeight,
                            width: barWidth,
                            backgroundColor: getScoreBarColor(entry.moodScore),
                            borderRadius: barWidth / 2,
                          },
                        ]}
                      />
                    </View>
                    <Text
                      style={[
                        styles.barLabel,
                        selectedPeriod === "monthly" && styles.barLabelSmall,
                      ]}
                      numberOfLines={1}
                    >
                      {formatDateLabel(entry.date, selectedPeriod)}
                    </Text>
                  </View>
                )
              })}
            </ScrollView>
          </View>
        </View>

        {/* Mood Type Chart */}
        <Text style={[styles.chartSubTitle, { marginTop: 25 }]}>
          Daily Mood
        </Text>
        <View style={styles.moodDotsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dotsScrollContent}
          >
            {entries.map((entry, index) => (
              <View key={index} style={styles.moodDotWrapper}>
                <View
                  style={[
                    styles.moodDot,
                    { backgroundColor: getBarColor(entry.mood) },
                  ]}
                >
                  {entry.mood && (
                    <Ionicons
                      name={
                        getMoodIcon(entry.mood) as keyof typeof Ionicons.glyphMap
                      }
                      size={selectedPeriod === "monthly" ? 14 : 18}
                      color="#fff"
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.dotLabel,
                    selectedPeriod === "monthly" && styles.dotLabelSmall,
                  ]}
                  numberOfLines={1}
                >
                  {formatDateLabel(entry.date, selectedPeriod)}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#43e97b" }]} />
            <Text style={styles.legendText}>Happy</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#4facfe" }]} />
            <Text style={styles.legendText}>Neutral</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#f5576c" }]} />
            <Text style={styles.legendText}>Sad</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#e0e0e0" }]} />
            <Text style={styles.legendText}>No Data</Text>
          </View>
        </View>
      </View>
    )
  }

  const renderMoodSummary = () => {
    if (!moodHistory || !moodHistory.summary) return null

    const { summary } = moodHistory

    return (
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{summary.totalEntries}</Text>
          <Text style={styles.summaryLabel}>Check-ins</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>
            {summary.averageScore || "-"}
          </Text>
          <Text style={styles.summaryLabel}>Avg Score</Text>
        </View>
        <View style={styles.summaryCard}>
          <Ionicons
            name={
              getMoodIcon(summary.predominantMood) as keyof typeof Ionicons.glyphMap
            }
            size={24}
            color={getMoodColor(summary.predominantMood)[0]}
          />
          <Text style={styles.summaryLabel}>
            {summary.predominantMood !== "none"
              ? summary.predominantMood.charAt(0).toUpperCase() +
                summary.predominantMood.slice(1)
              : "-"}
          </Text>
        </View>
      </View>
    )
  }

  const renderMoodDistribution = () => {
    if (!moodHistory || moodHistory.summary.totalEntries === 0) return null

    const { moodCounts } = moodHistory.summary
    const total = moodCounts.happy + moodCounts.sad + moodCounts.neutral
    if (total === 0) return null

    const happyPct = Math.round((moodCounts.happy / total) * 100)
    const neutralPct = Math.round((moodCounts.neutral / total) * 100)
    const sadPct = Math.round((moodCounts.sad / total) * 100)

    return (
      <View style={styles.distributionContainer}>
        <Text style={styles.chartSubTitle}>Mood Distribution</Text>
        <View style={styles.distributionBar}>
          {happyPct > 0 && (
            <View
              style={[
                styles.distributionSegment,
                {
                  flex: happyPct,
                  backgroundColor: "#43e97b",
                  borderTopLeftRadius: 8,
                  borderBottomLeftRadius: 8,
                },
              ]}
            />
          )}
          {neutralPct > 0 && (
            <View
              style={[
                styles.distributionSegment,
                { flex: neutralPct, backgroundColor: "#4facfe" },
              ]}
            />
          )}
          {sadPct > 0 && (
            <View
              style={[
                styles.distributionSegment,
                {
                  flex: sadPct,
                  backgroundColor: "#f5576c",
                  borderTopRightRadius: 8,
                  borderBottomRightRadius: 8,
                },
              ]}
            />
          )}
        </View>
        <View style={styles.distributionLabels}>
          {happyPct > 0 && (
            <Text style={[styles.distributionLabel, { color: "#43e97b" }]}>
              Happy {happyPct}%
            </Text>
          )}
          {neutralPct > 0 && (
            <Text style={[styles.distributionLabel, { color: "#4facfe" }]}>
              Neutral {neutralPct}%
            </Text>
          )}
          {sadPct > 0 && (
            <Text style={[styles.distributionLabel, { color: "#f5576c" }]}>
              Sad {sadPct}%
            </Text>
          )}
        </View>
      </View>
    )
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

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={getMoodColor(elderlyUser.currentMood)}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
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
            <Text style={styles.lastActive}>
              Last active: {elderlyUser.lastActive}
            </Text>
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
                name={
                  getMoodIcon(
                    elderlyUser.currentMood
                  ) as keyof typeof Ionicons.glyphMap
                }
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
                name={
                  elderlyUser.healthStatus === "good"
                    ? "checkmark-circle"
                    : elderlyUser.healthStatus === "fair"
                      ? "alert-circle"
                      : elderlyUser.healthStatus === "needs-attention"
                        ? "warning"
                        : "help-circle"
                }
                size={40}
                color={
                  elderlyUser.healthStatus === "good"
                    ? "#43e97b"
                    : elderlyUser.healthStatus === "fair"
                      ? "#fee140"
                      : elderlyUser.healthStatus === "needs-attention"
                        ? "#f5576c"
                        : "#999"
                }
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

        {/* Mood Graphs Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mood Analysis</Text>

          {/* Period Toggle */}
          <View style={styles.periodToggle}>
            <TouchableOpacity
              style={[
                styles.periodButton,
                selectedPeriod === "weekly" && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod("weekly")}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === "weekly" && styles.periodButtonTextActive,
                ]}
              >
                Weekly
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.periodButton,
                selectedPeriod === "monthly" && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod("monthly")}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === "monthly" && styles.periodButtonTextActive,
                ]}
              >
                Monthly
              </Text>
            </TouchableOpacity>
          </View>

          {/* Summary Cards */}
          {renderMoodSummary()}

          {/* Charts */}
          <View style={styles.chartCard}>
            {isMoodLoading ? (
              <View style={styles.chartLoading}>
                <ActivityIndicator size="small" color="#667eea" />
                <Text style={styles.chartLoadingText}>Loading chart...</Text>
              </View>
            ) : (
              renderMoodBarChart()
            )}
          </View>

          {/* Mood Distribution */}
          {!isMoodLoading && renderMoodDistribution()}
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
  // Period Toggle
  periodToggle: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    padding: 4,
    marginBottom: 15,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  periodButtonActive: {
    backgroundColor: "#667eea",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  periodButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666",
  },
  periodButtonTextActive: {
    color: "#fff",
  },
  // Summary
  summaryContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  summaryNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textTransform: "capitalize",
  },
  // Chart
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartSubTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
    marginBottom: 12,
  },
  chartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 160,
  },
  yAxisLabels: {
    width: 25,
    height: 120,
    justifyContent: "space-between",
    marginRight: 8,
    marginBottom: 20,
  },
  yLabel: {
    fontSize: 11,
    color: "#999",
    textAlign: "right",
  },
  chartArea: {
    flex: 1,
    height: 160,
    justifyContent: "flex-end",
  },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#f0f0f0",
  },
  barsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 4,
    gap: 6,
  },
  barWrapper: {
    alignItems: "center",
  },
  bar: {
    minHeight: 4,
  },
  barValue: {
    fontSize: 10,
    color: "#666",
    marginBottom: 3,
    fontWeight: "600",
  },
  barLabel: {
    fontSize: 11,
    color: "#999",
    marginTop: 6,
  },
  barLabelSmall: {
    fontSize: 9,
  },
  // Mood Dots
  moodDotsContainer: {
    marginTop: 5,
  },
  dotsScrollContent: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 4,
  },
  moodDotWrapper: {
    alignItems: "center",
  },
  moodDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  dotLabel: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
  },
  dotLabelSmall: {
    fontSize: 9,
  },
  // Legend
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 15,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: "#666",
  },
  // Distribution
  distributionContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  distributionBar: {
    flexDirection: "row",
    height: 16,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  distributionSegment: {
    height: "100%",
  },
  distributionLabels: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  distributionLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
  // Chart loading
  chartLoading: {
    paddingVertical: 40,
    alignItems: "center",
  },
  chartLoadingText: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
  },
  emptyChart: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyChartText: {
    marginTop: 12,
    fontSize: 14,
    color: "#999",
  },
  // Vital Signs
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
  // Actions
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
