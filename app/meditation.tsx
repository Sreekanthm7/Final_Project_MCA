import React, { useState, useEffect, useRef } from "react"
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Animated,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"

const MEDITATION_STEPS = [
  {
    title: "Find Your Space",
    instruction: "Sit comfortably in a quiet place. Close your eyes gently.",
    duration: 10,
  },
  {
    title: "Body Scan",
    instruction:
      "Starting from your toes, slowly bring awareness to each part of your body. Release any tension you find.",
    duration: 30,
  },
  {
    title: "Focus on Breath",
    instruction:
      "Breathe naturally. Notice each inhale and exhale without trying to change them.",
    duration: 30,
  },
  {
    title: "Mindful Awareness",
    instruction:
      "If thoughts arise, acknowledge them gently and return your focus to your breathing.",
    duration: 30,
  },
  {
    title: "Gratitude Moment",
    instruction:
      "Think of three things you are grateful for today. Feel the warmth of gratitude in your heart.",
    duration: 20,
  },
  {
    title: "Gentle Return",
    instruction:
      "Slowly wiggle your fingers and toes. When ready, open your eyes gently.",
    duration: 10,
  },
]

export default function MeditationScreen() {
  const router = useRouter()
  const [isActive, setIsActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [countdown, setCountdown] = useState(MEDITATION_STEPS[0].duration)
  const [isComplete, setIsComplete] = useState(false)
  const pulseAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>

    if (isActive && !isComplete) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev > 1) {
            return prev - 1
          } else {
            // Move to next step
            if (currentStep < MEDITATION_STEPS.length - 1) {
              const nextStep = currentStep + 1
              setCurrentStep(nextStep)
              return MEDITATION_STEPS[nextStep].duration
            } else {
              setIsActive(false)
              setIsComplete(true)
              return 0
            }
          }
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isActive, currentStep, isComplete])

  useEffect(() => {
    if (isActive) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      )
      pulse.start()
      return () => pulse.stop()
    }
  }, [isActive, pulseAnim])

  const toggleMeditation = () => {
    if (isComplete) {
      // Reset
      setCurrentStep(0)
      setCountdown(MEDITATION_STEPS[0].duration)
      setIsComplete(false)
      setIsActive(true)
    } else {
      setIsActive(!isActive)
    }
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return m > 0 ? `${m}:${s.toString().padStart(2, "0")}` : `${s}s`
  }

  const step = MEDITATION_STEPS[currentStep]

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#a18cd1", "#fbc2eb"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meditation</Text>
          <View style={{ width: 28 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Ionicons name="leaf" size={24} color="#a18cd1" />
          <Text style={styles.infoText}>
            A guided meditation session to bring peace and clarity to your mind.
            Find a comfortable position and let's begin.
          </Text>
        </View>

        {/* Meditation visual */}
        <View style={styles.exerciseContainer}>
          <Animated.View
            style={[
              styles.meditationCircle,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <LinearGradient
              colors={
                isComplete
                  ? (["#43e97b", "#38f9d7"] as const)
                  : (["#a18cd1", "#fbc2eb"] as const)
              }
              style={styles.circleGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {isComplete ? (
                <>
                  <Ionicons name="checkmark-circle" size={50} color="#fff" />
                  <Text style={styles.completeText}>Namaste</Text>
                </>
              ) : (
                <>
                  <Text style={styles.countdownText}>{formatTime(countdown)}</Text>
                  <Text style={styles.stepLabel}>
                    Step {currentStep + 1}/{MEDITATION_STEPS.length}
                  </Text>
                </>
              )}
            </LinearGradient>
          </Animated.View>
        </View>

        {/* Current instruction */}
        {!isComplete && (
          <View style={styles.instructionCard}>
            <Text style={styles.instructionTitle}>{step.title}</Text>
            <Text style={styles.instructionText}>{step.instruction}</Text>
          </View>
        )}

        {isComplete && (
          <View style={styles.completeCard}>
            <Text style={styles.completeTitle}>Session Complete!</Text>
            <Text style={styles.completeDescription}>
              Well done! You've completed a guided meditation session. Regular
              practice can help reduce stress, improve sleep, and boost your
              overall well-being.
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.controlButton} onPress={toggleMeditation}>
          <LinearGradient
            colors={
              isActive
                ? (["#f5576c", "#f093fb"] as const)
                : (["#a18cd1", "#fbc2eb"] as const)
            }
            style={styles.buttonGradient}
          >
            <Ionicons
              name={isComplete ? "refresh" : isActive ? "pause" : "play"}
              size={32}
              color="#fff"
            />
            <Text style={styles.buttonText}>
              {isComplete ? "Start Again" : isActive ? "Pause" : "Begin Meditation"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>Benefits of Meditation</Text>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color="#a18cd1" />
            <Text style={styles.benefitText}>Reduces stress and anxiety</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color="#a18cd1" />
            <Text style={styles.benefitText}>Improves emotional well-being</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color="#a18cd1" />
            <Text style={styles.benefitText}>Enhances memory and focus</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color="#a18cd1" />
            <Text style={styles.benefitText}>Promotes restful sleep</Text>
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
    backgroundColor: "#f3e5f5",
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  exerciseContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 30,
  },
  meditationCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: "hidden",
    shadowColor: "#a18cd1",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
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
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
  },
  stepLabel: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    marginTop: 8,
    fontWeight: "600",
  },
  completeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
  },
  instructionCard: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#a18cd1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  instructionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
  },
  completeCard: {
    backgroundColor: "#e8f5e9",
    padding: 25,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  completeTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 10,
  },
  completeDescription: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
    textAlign: "center",
  },
  controlButton: {
    marginVertical: 10,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#a18cd1",
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
    marginTop: 10,
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
