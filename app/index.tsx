import { useEffect } from "react"
import { View, ActivityIndicator, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { useUser } from "../contexts/UserContext"

export default function Index() {
  const router = useRouter()
  const { userType, isInitialized } = useUser()

  useEffect(() => {
    // Only navigate after the session has been restored
    if (!isInitialized) return

    // Navigate based on authentication status
    if (userType === "elderly") {
      router.replace("/(tabs)" as any)
    } else if (userType === "caretaker") {
      router.replace("/caretaker-dashboard" as any)
    } else {
      router.replace("/Login" as any)
    }
  }, [isInitialized, userType, router])

  // Show loading screen while checking authentication
  return (
    <LinearGradient
      colors={["#667eea", "#764ba2", "#f093fb"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
})
