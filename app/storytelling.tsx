import React, { useState } from "react"
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { generateStory } from "../services/openai"

interface StoryTheme {
  id: string
  title: string
  description: string
  icon: any
  colors: string[]
}

const STORY_THEMES: StoryTheme[] = [
  {
    id: "friendship",
    title: "Friendship",
    description: "Heartwarming tales of companionship",
    icon: "people",
    colors: ["#667eea", "#764ba2"],
  },
  {
    id: "nature",
    title: "Nature",
    description: "Beautiful stories from the natural world",
    icon: "leaf",
    colors: ["#43e97b", "#38f9d7"],
  },
  {
    id: "family",
    title: "Family",
    description: "Touching stories about family bonds",
    icon: "home",
    colors: ["#f093fb", "#f5576c"],
  },
  {
    id: "wisdom",
    title: "Wisdom",
    description: "Inspiring tales of life lessons",
    icon: "bulb",
    colors: ["#4facfe", "#00f2fe"],
  },
  {
    id: "adventure",
    title: "Adventure",
    description: "Gentle adventures and discoveries",
    icon: "compass",
    colors: ["#fa709a", "#fee140"],
  },
  {
    id: "kindness",
    title: "Kindness",
    description: "Stories of compassion and care",
    icon: "heart",
    colors: ["#ff6b9d", "#c06c84"],
  },
]

export default function StorytellingScreen() {
  const router = useRouter()
  const [currentStory, setCurrentStory] = useState<string>("")
  const [storyTitle, setStoryTitle] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showStory, setShowStory] = useState(false)

  const generateStoryFromTheme = async (theme: StoryTheme) => {
    setIsGenerating(true)
    setStoryTitle(theme.title)

    try {
      const story = await generateStory(theme.id)
      setCurrentStory(story)
      setShowStory(true)
    } catch (error) {
      console.error("Error generating story:", error)
      setCurrentStory(
        "Once upon a time, there was a kind soul who brought joy to everyone they met. Their warmth and wisdom made the world a brighter place."
      )
      setShowStory(true)
    } finally {
      setIsGenerating(false)
    }
  }

  const goBack = () => {
    if (showStory) {
      setShowStory(false)
      setCurrentStory("")
    } else {
      router.back()
    }
  }

  if (showStory) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={goBack}>
              <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{storyTitle} Story</Text>
            <View style={{ width: 28 }} />
          </View>
        </LinearGradient>

        <ScrollView
          style={styles.storyContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.storyCard}>
            <Ionicons
              name="book-outline"
              size={40}
              color="#667eea"
              style={styles.storyIcon}
            />
            <Text style={styles.storyText}>{currentStory}</Text>
          </View>

          <TouchableOpacity
            style={styles.newStoryButton}
            onPress={() => setShowStory(false)}
          >
            <LinearGradient
              colors={["#667eea", "#764ba2"]}
              style={styles.buttonGradient}
            >
              <Ionicons name="refresh" size={20} color="#fff" />
              <Text style={styles.newStoryButtonText}>Choose Another Theme</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={goBack}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Story Time</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.headerInfo}>
          <Ionicons name="book" size={60} color="#fff" />
          <Text style={styles.headerDescription}>
            Enjoy heartwarming stories to brighten your day
          </Text>
        </View>
      </LinearGradient>

      {isGenerating ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>Creating your story...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color="#667eea" />
            <Text style={styles.infoText}>
              Choose a theme below and let AI create a beautiful,
              uplifting story just for you!
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Choose a Theme</Text>

          <View style={styles.themesGrid}>
            {STORY_THEMES.map((theme) => (
              <TouchableOpacity
                key={theme.id}
                style={styles.themeCard}
                onPress={() => generateStoryFromTheme(theme)}
              >
                <LinearGradient
                  colors={theme.colors}
                  style={styles.themeGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name={theme.icon} size={40} color="#fff" />
                  <Text style={styles.themeTitle}>{theme.title}</Text>
                  <Text style={styles.themeDescription}>
                    {theme.description}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
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
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  headerInfo: {
    alignItems: "center",
  },
  headerDescription: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 15,
    textAlign: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#e8eaf6",
    padding: 15,
    borderRadius: 15,
    marginBottom: 25,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  themesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  themeCard: {
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
  themeGradient: {
    padding: 20,
    alignItems: "center",
    minHeight: 160,
    justifyContent: "center",
  },
  themeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 12,
    textAlign: "center",
  },
  themeDescription: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 5,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: "#666",
  },
  storyContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  storyCard: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  storyIcon: {
    alignSelf: "center",
    marginBottom: 20,
  },
  storyText: {
    fontSize: 18,
    lineHeight: 28,
    color: "#333",
    textAlign: "justify",
  },
  newStoryButton: {
    marginTop: 20,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },
  newStoryButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
})
