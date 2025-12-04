import React from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { useUser } from "../contexts/UserContext"
import { MOCK_CARETAKER } from "../data/mockData"

export default function UserSelectionScreen() {
  const router = useRouter()
  const { setUserType, setCurrentUser } = useUser()

  const handleElderlyUser = async () => {
    await setUserType("elderly")
    router.replace("/(tabs)")
  }

  const handleCaretakerUser = async () => {
    await setUserType("caretaker")
    setCurrentUser(MOCK_CARETAKER) // In real app, this would come from login
    router.replace("/caretaker-dashboard" as any)
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Ionicons name="people-circle" size={80} color="#fff" />
            <Text style={styles.title}>Welcome to ElderCare</Text>
            <Text style={styles.subtitle}>Please select your user type</Text>
          </View>

          <View style={styles.cardsContainer}>
            <TouchableOpacity
              style={styles.card}
              onPress={handleElderlyUser}
              activeOpacity={0.8}
            >
              <View style={styles.cardIconContainer}>
                <Ionicons name="person" size={60} color="#667eea" />
              </View>
              <Text style={styles.cardTitle}>Elderly User</Text>
              <Text style={styles.cardDescription}>
                Access activities, chatbot, and wellness features
              </Text>
              <View style={styles.cardButton}>
                <Text style={styles.cardButtonText}>Continue</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              onPress={handleCaretakerUser}
              activeOpacity={0.8}
            >
              <View style={styles.cardIconContainer}>
                <Ionicons name="medical" size={60} color="#43e97b" />
              </View>
              <Text style={styles.cardTitle}>Caretaker</Text>
              <Text style={styles.cardDescription}>
                Monitor and manage elderly users under your care
              </Text>
              <View style={[styles.cardButton, styles.cardButtonCaretaker]}>
                <Text style={styles.cardButtonText}>Continue</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Ionicons name="shield-checkmark" size={20} color="rgba(255,255,255,0.7)" />
            <Text style={styles.footerText}>Your data is secure and private</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
  },
  cardsContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  cardIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  cardButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#667eea",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 10,
  },
  cardButtonCaretaker: {
    backgroundColor: "#43e97b",
  },
  cardButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    gap: 8,
  },
  footerText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
  },
})
