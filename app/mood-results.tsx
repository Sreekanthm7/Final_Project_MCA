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
import { MoodAnalysis } from "../services/openai"

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

  const getMoodIcon = () => {
    switch (analysis.mood) {
      case "happy":
        return "happy"
      case "sad":
        return "sad"
      default:
        return "happy-outline"
    }
  }

  const getMoodColor = () => {
    switch (analysis.mood) {
      case "happy":
        return ["#43e97b", "#38f9d7"]
      case "sad":
        return ["#f5576c", "#f093fb"]
      default:
        return ["#4facfe", "#00f2fe"]
    }
  }

  const getMoodMessage = () => {
    switch (analysis.mood) {
      case "happy":
        return "You're feeling great today!"
      case "sad":
        return "I noticed you might be feeling down"
      default:
        return "You're doing okay today"
    }
  }

  const renderRecommendations = () => {
    if (analysis.mood === "sad") {
      return (
        <>
          <Text style={styles.sectionTitle}>Recommended for You</Text>

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
                <Text style={styles.recommendationTitle}>Story Time</Text>
                <Text style={styles.recommendationDescription}>
                  Heartwarming stories to bring joy and comfort
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
                  Connect with friends who understand and care
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </>
      )
    } else {
      return (
        <>
          <Text style={styles.sectionTitle}>Keep Up the Good Work!</Text>

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
              <Ionicons name="wind" size={40} color="#fff" />
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationTitle}>
                  Breathing Exercise
                </Text>
                <Text style={styles.recommendationDescription}>
                  Deep breathing to maintain calmness and focus
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

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
                <Text style={styles.recommendationTitle}>Gentle Yoga</Text>
                <Text style={styles.recommendationDescription}>
                  Light stretches and poses for flexibility
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </>
      )
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={getMoodColor()}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.moodIconContainer}>
          <Ionicons name={getMoodIcon()} size={80} color="#fff" />
        </View>
        <Text style={styles.moodMessage}>{getMoodMessage()}</Text>
        <Text style={styles.moodType}>
          Mood: {analysis.mood.charAt(0).toUpperCase() + analysis.mood.slice(1)}
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {analysis.emotions && analysis.emotions.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Detected Emotions</Text>
            <View style={styles.emotionsContainer}>
              {analysis.emotions.map((emotion, index) => (
                <View key={index} style={styles.emotionTag}>
                  <Text style={styles.emotionText}>{emotion}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {analysis.concerns && analysis.concerns.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Areas of Concern</Text>
            {analysis.concerns.map((concern, index) => (
              <View key={index} style={styles.concernItem}>
                <Ionicons
                  name="alert-circle"
                  size={20}
                  color="#f5576c"
                  style={styles.concernIcon}
                />
                <Text style={styles.concernText}>{concern}</Text>
              </View>
            ))}
          </>
        )}

        {renderRecommendations()}

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
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    marginTop: 10,
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
  emotionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  concernItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#f5576c",
  },
  concernIcon: {
    marginRight: 12,
  },
  concernText: {
    flex: 1,
    fontSize: 15,
    color: "#333",
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
