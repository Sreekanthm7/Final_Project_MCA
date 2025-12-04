import React, { useState, useEffect } from "react"
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"

export default function BreathingScreen() {
  const router = useRouter()
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [countdown, setCountdown] = useState(4)
  const [scale] = useState(new Animated.Value(1))

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>

    if (isActive) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev > 1) {
            return prev - 1
          } else {
            // Move to next phase
            if (phase === "inhale") {
              setPhase("hold")
              return 4
            } else if (phase === "hold") {
              setPhase("exhale")
              return 4
            } else {
              setPhase("inhale")
              return 4
            }
          }
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isActive, phase])

  useEffect(() => {
    if (isActive) {
      if (phase === "inhale") {
        Animated.timing(scale, {
          toValue: 1.5,
          duration: 4000,
          useNativeDriver: true,
        }).start()
      } else if (phase === "exhale") {
        Animated.timing(scale, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }).start()
      }
    }
  }, [phase, isActive, scale])

  const toggleExercise = () => {
    if (!isActive) {
      setPhase("inhale")
      setCountdown(4)
    }
    setIsActive(!isActive)
  }

  const getPhaseInstruction = () => {
    switch (phase) {
      case "inhale":
        return "Breathe In"
      case "hold":
        return "Hold"
      case "exhale":
        return "Breathe Out"
    }
  }

  const getPhaseColor = () => {
    switch (phase) {
      case "inhale":
        return ["#4facfe", "#00f2fe"] as const
      case "hold":
        return ["#43e97b", "#38f9d7"] as const
      case "exhale":
        return ["#667eea", "#764ba2"] as const
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#4facfe", "#00f2fe"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Breathing Exercise</Text>
          <View style={{ width: 28 }} />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#4facfe" />
          <Text style={styles.infoText}>
            Follow the breathing pattern: Inhale for 4 seconds, hold for 4
            seconds, exhale for 4 seconds.
          </Text>
        </View>

        <View style={styles.exerciseContainer}>
          <Animated.View
            style={[
              styles.breathingCircle,
              {
                transform: [{ scale }],
              },
            ]}
          >
            <LinearGradient
              colors={getPhaseColor()}
              style={styles.circleGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.countdownText}>{countdown}</Text>
              <Text style={styles.phaseText}>{getPhaseInstruction()}</Text>
            </LinearGradient>
          </Animated.View>
        </View>

        <TouchableOpacity style={styles.controlButton} onPress={toggleExercise}>
          <LinearGradient
            colors={isActive ? ["#f5576c", "#f093fb"] : ["#4facfe", "#00f2fe"]}
            style={styles.buttonGradient}
          >
            <Ionicons
              name={isActive ? "pause" : "play"}
              size={32}
              color="#fff"
            />
            <Text style={styles.buttonText}>
              {isActive ? "Pause" : "Start Exercise"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>Benefits</Text>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4facfe" />
            <Text style={styles.benefitText}>Reduces stress and anxiety</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4facfe" />
            <Text style={styles.benefitText}>Improves focus and clarity</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4facfe" />
            <Text style={styles.benefitText}>Lowers blood pressure</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4facfe" />
            <Text style={styles.benefitText}>Promotes better sleep</Text>
          </View>
        </View>
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
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#e3f2fd",
    padding: 15,
    borderRadius: 15,
    marginBottom: 30,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  exerciseContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 30,
  },
  breathingCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  circleGradient: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  countdownText: {
    fontSize: 72,
    fontWeight: "bold",
    color: "#fff",
  },
  phaseText: {
    fontSize: 20,
    color: "#fff",
    marginTop: 10,
    fontWeight: "600",
  },
  controlButton: {
    marginVertical: 20,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 12,
  },
  benefitsCard: {
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
  benefitsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
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
})
