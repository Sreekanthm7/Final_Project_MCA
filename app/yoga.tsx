import React, { useState } from "react"
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

interface YogaPose {
  id: string
  name: string
  duration: string
  difficulty: "Easy" | "Medium"
  benefits: string[]
  instructions: string[]
  icon: any
}

const YOGA_POSES: YogaPose[] = [
  {
    id: "1",
    name: "Seated Forward Bend",
    duration: "2-3 minutes",
    difficulty: "Easy",
    benefits: [
      "Stretches spine and hamstrings",
      "Calms the mind",
      "Reduces stress",
    ],
    instructions: [
      "Sit with legs extended forward",
      "Inhale and lengthen your spine",
      "Exhale and slowly bend forward from hips",
      "Hold the position and breathe deeply",
    ],
    icon: "body",
  },
  {
    id: "2",
    name: "Cat-Cow Stretch",
    duration: "2-3 minutes",
    difficulty: "Easy",
    benefits: [
      "Improves spine flexibility",
      "Relieves back tension",
      "Enhances posture",
    ],
    instructions: [
      "Start on hands and knees",
      "Inhale, drop belly, lift chest (Cow)",
      "Exhale, round spine, tuck chin (Cat)",
      "Repeat slowly for several breaths",
    ],
    icon: "sync",
  },
  {
    id: "3",
    name: "Legs Up the Wall",
    duration: "5-10 minutes",
    difficulty: "Easy",
    benefits: [
      "Improves circulation",
      "Reduces leg swelling",
      "Promotes relaxation",
    ],
    instructions: [
      "Lie on your back near a wall",
      "Extend legs up the wall",
      "Keep arms relaxed at sides",
      "Breathe deeply and relax",
    ],
    icon: "trending-up",
  },
  {
    id: "4",
    name: "Seated Twist",
    duration: "1-2 minutes per side",
    difficulty: "Easy",
    benefits: [
      "Improves digestion",
      "Stretches spine",
      "Releases tension",
    ],
    instructions: [
      "Sit with legs crossed",
      "Place right hand behind you",
      "Left hand on right knee",
      "Gently twist to the right",
      "Repeat on other side",
    ],
    icon: "sync",
  },
  {
    id: "5",
    name: "Child's Pose",
    duration: "3-5 minutes",
    difficulty: "Easy",
    benefits: [
      "Relieves stress",
      "Stretches hips and thighs",
      "Calms the nervous system",
    ],
    instructions: [
      "Kneel on the floor",
      "Sit back on your heels",
      "Fold forward, arms extended",
      "Rest forehead on ground",
    ],
    icon: "moon",
  },
  {
    id: "6",
    name: "Gentle Neck Rolls",
    duration: "1-2 minutes",
    difficulty: "Easy",
    benefits: [
      "Releases neck tension",
      "Improves flexibility",
      "Reduces headaches",
    ],
    instructions: [
      "Sit comfortably with straight spine",
      "Slowly roll head in circles",
      "Move gently and mindfully",
      "Repeat in both directions",
    ],
    icon: "refresh",
  },
]

export default function YogaScreen() {
  const router = useRouter()
  const [selectedPose, setSelectedPose] = useState<YogaPose | null>(null)

  if (selectedPose) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={["#43e97b", "#38f9d7"]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => setSelectedPose(null)}>
              <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{selectedPose.name}</Text>
            <View style={{ width: 28 }} />
          </View>
        </LinearGradient>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <View style={styles.detailIcon}>
                <Ionicons name={selectedPose.icon} size={40} color="#43e97b" />
              </View>
              <View style={styles.detailMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="time" size={18} color="#666" />
                  <Text style={styles.metaText}>{selectedPose.duration}</Text>
                </View>
                <View style={styles.difficultyBadge}>
                  <Text style={styles.difficultyText}>
                    {selectedPose.difficulty}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Benefits</Text>
            {selectedPose.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color="#43e97b" />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}

            <Text style={styles.sectionTitle}>Instructions</Text>
            {selectedPose.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}

            <View style={styles.warningCard}>
              <Ionicons name="alert-circle" size={20} color="#f5576c" />
              <Text style={styles.warningText}>
                Stop if you feel any pain. Consult your doctor before starting
                any new exercise routine.
              </Text>
            </View>
          </View>
        </ScrollView>
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
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gentle Yoga</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.headerInfo}>
          <Ionicons name="body" size={60} color="#fff" />
          <Text style={styles.headerDescription}>
            Simple yoga poses for flexibility and relaxation
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#43e97b" />
          <Text style={styles.infoText}>
            These gentle yoga poses are perfect for seniors. Practice daily for
            better flexibility and peace of mind.
          </Text>
        </View>

        <Text style={styles.listTitle}>Choose a Pose</Text>

        {YOGA_POSES.map((pose) => (
          <TouchableOpacity
            key={pose.id}
            style={styles.poseCard}
            onPress={() => setSelectedPose(pose)}
          >
            <View style={styles.poseIcon}>
              <Ionicons name={pose.icon} size={32} color="#43e97b" />
            </View>
            <View style={styles.poseInfo}>
              <Text style={styles.poseName}>{pose.name}</Text>
              <View style={styles.poseMeta}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.poseDuration}>{pose.duration}</Text>
                <View style={styles.poseDifficulty}>
                  <Text style={styles.poseDifficultyText}>{pose.difficulty}</Text>
                </View>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>
        ))}

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
    backgroundColor: "#e7f9f0",
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
  listTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  poseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  poseIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e7f9f0",
    alignItems: "center",
    justifyContent: "center",
  },
  poseInfo: {
    flex: 1,
    marginLeft: 15,
  },
  poseName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  poseMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  poseDuration: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
    marginRight: 10,
  },
  poseDifficulty: {
    backgroundColor: "#43e97b",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  poseDifficultyText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  detailCard: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    marginBottom: 20,
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  detailIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e7f9f0",
    alignItems: "center",
    justifyContent: "center",
  },
  detailMeta: {
    flex: 1,
    marginLeft: 20,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  metaText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 8,
  },
  difficultyBadge: {
    backgroundColor: "#43e97b",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  difficultyText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 15,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  benefitText: {
    marginLeft: 12,
    fontSize: 15,
    color: "#666",
  },
  instructionItem: {
    flexDirection: "row",
    marginBottom: 15,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#43e97b",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  instructionNumberText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  instructionText: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
  warningCard: {
    flexDirection: "row",
    backgroundColor: "#fff5f5",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#f5576c",
  },
  warningText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
})
