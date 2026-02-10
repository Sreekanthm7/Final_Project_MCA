import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useLocalSearchParams, useRouter } from "expo-router"
import React, { useEffect, useState } from "react"
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

interface MoodAnalysis {
  mood: "Normal" | "Stressed" | "Depressed" | "Highly Depressed" | "Unknown"
  confidence: "low" | "medium" | "high"
  emotionsDetected: string[]
  reason: string
  analysisSource: "ai" | "fallback"
}

export default function MoodResultsScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const [analysis, setAnalysis] = useState<MoodAnalysis | null>(null)

  useEffect(() => {
    if (params.analysisData) {
      try {
        const data = JSON.parse(params.analysisData as string)
        setAnalysis(data)
      } catch (error) {
        console.error("Error parsing analysis data:", error)
      }
    }
  }, [params])

  if (!analysis) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    )
  }

  const isConcerningMood =
    analysis.mood === "Depressed" ||
    analysis.mood === "Highly Depressed" ||
    analysis.mood === "Stressed"

  const getMoodIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (analysis.mood) {
      case "Normal":
        return "happy"
      case "Stressed":
        return "alert-circle"
      case "Depressed":
        return "sad"
      case "Highly Depressed":
        return "warning"
      default:
        return "help-circle"
    }
  }

  const getMoodColor = (): readonly [string, string] => {
    switch (analysis.mood) {
      case "Normal":
        return ["#43e97b", "#38f9d7"] as const
      case "Stressed":
        return ["#f6d365", "#fda085"] as const
      case "Depressed":
        return ["#f5576c", "#f093fb"] as const
      case "Highly Depressed":
        return ["#c62828", "#e53935"] as const
      default:
        return ["#4facfe", "#00f2fe"] as const
    }
  }

  const getMoodMessage = () => {
    switch (analysis.mood) {
      case "Normal":
        return "You're doing great today!"
      case "Stressed":
        return "You seem a bit stressed today"
      case "Depressed":
        return "I notice you might be feeling down"
      case "Highly Depressed":
        return "I'm concerned about how you're feeling"
      default:
        return "Thank you for sharing today"
    }
  }

  const getMoodDescription = () => {
    switch (analysis.mood) {
      case "Normal":
        return "Your responses suggest a positive and stable emotional state. Keep up the healthy habits!"
      case "Stressed":
        return "Your responses indicate some stress and tension. Taking time for relaxation can help you feel better."
      case "Depressed":
        return "Your responses suggest you may be going through a difficult time. Remember, it's okay to ask for help. Your caretaker has been notified."
      case "Highly Depressed":
        return "Your responses indicate significant emotional distress. Your caretaker has been alerted and will reach out to you. You are not alone in this."
      default:
        return "Thank you for completing today's check-in."
    }
  }

  const getRiskBadge = () => {
    if (analysis.mood === "Highly Depressed") {
      return { text: "High Risk", color: "#c62828", bg: "#ffebee" }
    }
    if (analysis.mood === "Depressed") {
      return { text: "Moderate Risk", color: "#e65100", bg: "#fff3e0" }
    }
    if (analysis.mood === "Stressed") {
      return { text: "Mild Concern", color: "#f57f17", bg: "#fffde7" }
    }
    return null
  }

  const riskBadge = getRiskBadge()

  // Therapy modules for concerning moods (Stressed / Depressed / Highly Depressed)
  const renderTherapyModules = () => (
    <>
      <Text style={styles.sectionTitle}>Recommended Therapy</Text>
      <Text style={styles.sectionSubtitle}>
        These activities are specifically chosen to help you feel better
      </Text>

      <TouchableOpacity
        style={styles.recommendationCard}
        onPress={() => router.push("/music-therapy")}
      >
        <LinearGradient
          colors={["#43e97b", "#38f9d7"]}
          style={styles.recommendationGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="musical-notes" size={40} color="#fff" />
          <View style={styles.recommendationContent}>
            <Text style={styles.recommendationTitle}>Music Therapy</Text>
            <Text style={styles.recommendationDescription}>
              Soothing music to calm your mind and lift your spirits
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.recommendationCard}
        onPress={() => router.push("/storytelling")}
      >
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          style={styles.recommendationGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="book" size={40} color="#fff" />
          <View style={styles.recommendationContent}>
            <Text style={styles.recommendationTitle}>
              Storytelling & Audiobooks
            </Text>
            <Text style={styles.recommendationDescription}>
              Heartwarming stories to bring comfort and distraction
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.recommendationCard}
        onPress={() => router.push("/(tabs)/community")}
      >
        <LinearGradient
          colors={["#f093fb", "#f5576c"]}
          style={styles.recommendationGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="people" size={40} color="#fff" />
          <View style={styles.recommendationContent}>
            <Text style={styles.recommendationTitle}>Community Chat</Text>
            <Text style={styles.recommendationDescription}>
              Connect with friends who understand and care about you
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </>
  )

  // Wellness modules for Normal mood
  const renderWellnessModules = () => (
    <>
      <Text style={styles.sectionTitle}>Keep Up the Good Work!</Text>
      <Text style={styles.sectionSubtitle}>
        Maintain your wellbeing with these activities
      </Text>

      <TouchableOpacity
        style={styles.recommendationCard}
        onPress={() => router.push("/yoga")}
      >
        <LinearGradient
          colors={["#43e97b", "#38f9d7"]}
          style={styles.recommendationGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="body" size={40} color="#fff" />
          <View style={styles.recommendationContent}>
            <Text style={styles.recommendationTitle}>Yoga Exercises</Text>
            <Text style={styles.recommendationDescription}>
              Gentle stretches for flexibility and wellness
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.recommendationCard}
        onPress={() => router.push("/breathing")}
      >
        <LinearGradient
          colors={["#4facfe", "#00f2fe"]}
          style={styles.recommendationGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="fitness" size={40} color="#fff" />
          <View style={styles.recommendationContent}>
            <Text style={styles.recommendationTitle}>Breathing Exercises</Text>
            <Text style={styles.recommendationDescription}>
              Deep breathing to maintain calmness and focus
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.recommendationCard}
        onPress={() => router.push("/meditation")}
      >
        <LinearGradient
          colors={["#a18cd1", "#fbc2eb"]}
          style={styles.recommendationGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="leaf" size={40} color="#fff" />
          <View style={styles.recommendationContent}>
            <Text style={styles.recommendationTitle}>Meditation Guidance</Text>
            <Text style={styles.recommendationDescription}>
              Guided meditation for inner peace and clarity
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </>
  )

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={getMoodColor()}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/(tabs)")}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.moodIconContainer}>
          <Ionicons name={getMoodIcon()} size={80} color="#fff" />
        </View>
        <Text style={styles.moodMessage}>{getMoodMessage()}</Text>
        <Text style={styles.moodType}>Mood: {analysis.mood}</Text>
        {analysis.confidence && (
          <Text style={styles.confidenceText}>
            Confidence: {analysis.confidence}
          </Text>
        )}
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Risk Badge */}
        {riskBadge && (
          <View
            style={[styles.riskBadgeContainer, { backgroundColor: riskBadge.bg }]}
          >
            <Ionicons name="shield" size={20} color={riskBadge.color} />
            <Text style={[styles.riskBadgeText, { color: riskBadge.color }]}>
              {riskBadge.text}
            </Text>
          </View>
        )}

        {/* Caretaker notification info */}
        {(analysis.mood === "Depressed" || analysis.mood === "Highly Depressed") && (
          <View style={styles.notificationBanner}>
            <Ionicons name="notifications" size={22} color="#667eea" />
            <Text style={styles.notificationText}>
              Your caretaker has been notified and will check in with you soon.
            </Text>
          </View>
        )}

        {/* Mood Description */}
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionText}>{getMoodDescription()}</Text>
        </View>

        {/* AI Analysis Reason */}
        {analysis.reason && (
          <View style={styles.reasonCard}>
            <View style={styles.reasonHeader}>
              <Ionicons name="analytics" size={20} color="#667eea" />
              <Text style={styles.reasonTitle}>Analysis Summary</Text>
            </View>
            <Text style={styles.reasonText}>{analysis.reason}</Text>
            {analysis.analysisSource && (
              <Text style={styles.sourceText}>
                Analysis by: {analysis.analysisSource === "ai" ? "AI Model" : "Rule-based System"}
              </Text>
            )}
          </View>
        )}

        {/* Detected Emotions */}
        {analysis.emotionsDetected && analysis.emotionsDetected.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Detected Emotions</Text>
            <View style={styles.emotionsContainer}>
              {analysis.emotionsDetected.map((emotion, index) => (
                <View
                  key={index}
                  style={[
                    styles.emotionTag,
                    isConcerningMood && styles.emotionTagConcerning,
                  ]}
                >
                  <Text
                    style={[
                      styles.emotionText,
                      isConcerningMood && styles.emotionTextConcerning,
                    ]}
                  >
                    {emotion}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Smart Navigation: Therapy vs Wellness modules */}
        {isConcerningMood ? renderTherapyModules() : renderWellnessModules()}

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.replace("/(tabs)")}
        >
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>

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
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  moodIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  moodMessage: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  moodType: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "600",
  },
  confidenceText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 5,
    textTransform: "capitalize",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  riskBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 15,
    gap: 8,
  },
  riskBadgeText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  notificationBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8eaf6",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    gap: 12,
  },
  notificationText: {
    flex: 1,
    fontSize: 14,
    color: "#3949ab",
    lineHeight: 20,
  },
  descriptionCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  descriptionText: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
  },
  reasonCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#667eea",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reasonHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  reasonTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  reasonText: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
  },
  sourceText: {
    fontSize: 12,
    color: "#999",
    marginTop: 10,
    fontStyle: "italic",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    marginTop: 10,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 15,
  },
  emotionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 25,
  },
  emotionTag: {
    backgroundColor: "#667eea",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  emotionTagConcerning: {
    backgroundColor: "#f5576c",
  },
  emotionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  emotionTextConcerning: {
    color: "#fff",
  },
  recommendationCard: {
    marginBottom: 15,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  recommendationGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  recommendationContent: {
    flex: 1,
    marginLeft: 15,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  recommendationDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
  },
  homeButton: {
    backgroundColor: "#667eea",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  homeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
})
