import React from "react"
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

interface Activity {
  id: string
  title: string
  description: string
  icon: any
  colors: readonly [string, string, ...string[]]
  route: string
  category: "wellness" | "therapy" | "social"
}

const ACTIVITIES: Activity[] = [
  {
    id: "1",
    title: "Breathing Exercise",
    description: "Deep breathing techniques for relaxation",
    icon: "fitness",
    colors: ["#4facfe", "#00f2fe"] as const,
    route: "/breathing",
    category: "wellness",
  },
  {
    id: "2",
    title: "Gentle Yoga",
    description: "Simple yoga poses for flexibility",
    icon: "body",
    colors: ["#43e97b", "#38f9d7"] as const,
    route: "/yoga",
    category: "wellness",
  },
  {
    id: "3",
    title: "Music Therapy",
    description: "Soothing music to calm your mind",
    icon: "musical-notes",
    colors: ["#667eea", "#764ba2"] as const,
    route: "/music-therapy",
    category: "therapy",
  },
  {
    id: "4",
    title: "Story Time",
    description: "Heartwarming stories to brighten your day",
    icon: "book",
    colors: ["#f093fb", "#f5576c"] as const,
    route: "/storytelling",
    category: "therapy",
  },
  {
    id: "5",
    title: "Community Chat",
    description: "Connect with friends and share",
    icon: "people",
    colors: ["#fa709a", "#fee140"] as const,
    route: "/(tabs)/community",
    category: "social",
  },
]

export default function ActivitiesScreen() {
  const router = useRouter()

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case "wellness":
        return "Wellness Activities"
      case "therapy":
        return "Therapy & Relaxation"
      case "social":
        return "Social Connection"
      default:
        return "Activities"
    }
  }

  const renderActivitiesByCategory = (category: "wellness" | "therapy" | "social") => {
    const categoryActivities = ACTIVITIES.filter((a) => a.category === category)

    return (
      <View key={category} style={styles.categorySection}>
        <Text style={styles.categoryTitle}>{getCategoryTitle(category)}</Text>
        {categoryActivities.map((activity) => (
          <TouchableOpacity
            key={activity.id}
            style={styles.activityCard}
            onPress={() => router.push(activity.route as any)}
          >
            <LinearGradient
              colors={activity.colors}
              style={styles.activityGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.activityIcon}>
                <Ionicons name={activity.icon} size={36} color="#fff" />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityDescription}>
                  {activity.description}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        ))}
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
        <Text style={styles.headerTitle}>Activities</Text>
        <Text style={styles.headerSubtitle}>
          Choose activities to improve your well-being
        </Text>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.motivationCard}>
          <View style={styles.motivationIcon}>
            <Ionicons name="heart" size={32} color="#f5576c" />
          </View>
          <View style={styles.motivationContent}>
            <Text style={styles.motivationTitle}>Stay Active!</Text>
            <Text style={styles.motivationText}>
              Regular activities help maintain physical and mental health
            </Text>
          </View>
        </View>

        {renderActivitiesByCategory("wellness")}
        {renderActivitiesByCategory("therapy")}
        {renderActivitiesByCategory("social")}

        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Activity Tips</Text>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={20} color="#667eea" />
            <Text style={styles.tipText}>
              Start slowly and listen to your body
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={20} color="#667eea" />
            <Text style={styles.tipText}>
              Practice daily for best results
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={20} color="#667eea" />
            <Text style={styles.tipText}>
              Consult your doctor if you have concerns
            </Text>
          </View>
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
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  motivationCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  motivationIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff5f5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  motivationContent: {
    flex: 1,
  },
  motivationTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  motivationText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  categorySection: {
    marginBottom: 25,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  activityCard: {
    marginBottom: 15,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  activityGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  activityIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  activityDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
  },
  tipsCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  tipText: {
    marginLeft: 12,
    fontSize: 15,
    color: "#666",
  },
})
