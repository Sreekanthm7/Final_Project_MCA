import React from "react"
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"

export default function SignupSelectionScreen() {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#667eea", "#764ba2", "#f093fb"]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.header}>
            <Ionicons name="person-add" size={80} color="#fff" />
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Choose your account type</Text>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.cardsContainer}
            showsVerticalScrollIndicator={false}
          >
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push("/signup-elderly" as any)}
              activeOpacity={0.8}
            >
              <View style={styles.cardIconContainer}>
                <Ionicons name="person" size={60} color="#667eea" />
              </View>
              <Text style={styles.cardTitle}>Elderly User</Text>
              <Text style={styles.cardDescription}>
                Sign up to access wellness activities, chatbot support, and
                community features
              </Text>
              <View style={styles.cardButton}>
                <Text style={styles.cardButtonText}>Sign Up</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push("/signup-caretaker" as any)}
              activeOpacity={0.8}
            >
              <View style={styles.cardIconContainer}>
                <Ionicons name="medical" size={60} color="#43e97b" />
              </View>
              <Text style={styles.cardTitle}>Caretaker</Text>
              <Text style={styles.cardDescription}>
                Register as a caretaker to monitor and manage elderly users
                under your care
              </Text>
              <View style={[styles.cardButton, styles.cardButtonCaretaker]}>
                <Text style={styles.cardButtonText}>Sign Up</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account?{" "}
              <Text
                style={styles.link}
                onPress={() => router.replace("/Login" as any)}
              >
                Sign In
              </Text>
            </Text>
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
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
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
  scrollView: {
    flex: 1,
  },
  cardsContainer: {
    paddingVertical: 10,
    gap: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    minHeight: 280,
    justifyContent: "center",
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
    alignItems: "center",
    paddingVertical: 20,
  },
  footerText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 16,
  },
  link: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
})
