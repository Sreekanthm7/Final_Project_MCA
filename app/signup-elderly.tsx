import React, { useState } from "react"
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function SignupElderlyScreen() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [age, setAge] = useState("")
  const [address, setAddress] = useState("")
  const [caretakerId, setCaretakerId] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    if (!name || !email || !phone || !password || !age || !address) {
      Alert.alert("Error", "Please fill in all required fields")
      return false
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long")
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address")
      return false
    }

    const ageNum = parseInt(age)
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 120) {
      Alert.alert("Error", "Please enter a valid age")
      return false
    }

    return true
  }

  const handleSignup = async () => {
    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Here you would integrate with your backend API
      // For now, we'll just save to AsyncStorage and navigate

      await AsyncStorage.setItem("userName", name)
      await AsyncStorage.setItem("userEmail", email)
      await AsyncStorage.setItem("userPhone", phone)
      await AsyncStorage.setItem("userAge", age)
      await AsyncStorage.setItem("userAddress", address)

      Alert.alert(
        "Success",
        "Account created successfully!",
        [
          {
            text: "OK",
            onPress: () => router.replace("/user-selection" as any),
          },
        ]
      )
    } catch (error) {
      console.error("Signup error:", error)
      Alert.alert("Error", "Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <LinearGradient
      colors={["#667eea", "#764ba2", "#f093fb"]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            <View style={styles.header}>
              <View style={styles.iconCircle}>
                <Ionicons name="person" size={60} color="#fff" />
              </View>
              <Text style={styles.title}>Elderly User Signup</Text>
              <Text style={styles.subtitle}>Create your account</Text>
            </View>

            <View style={styles.formContainer}>
              {/* Name Input */}
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#667eea"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name *"
                  placeholderTextColor="#999"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#667eea"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address *"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Phone Input */}
              <View style={styles.inputContainer}>
                <Ionicons
                  name="call-outline"
                  size={20}
                  color="#667eea"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number *"
                  placeholderTextColor="#999"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#667eea"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Password *"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#667eea"
                  />
                </TouchableOpacity>
              </View>

              {/* Age Input */}
              <View style={styles.inputContainer}>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color="#667eea"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Age *"
                  placeholderTextColor="#999"
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                />
              </View>

              {/* Address Input */}
              <View style={styles.inputContainer}>
                <Ionicons
                  name="location-outline"
                  size={20}
                  color="#667eea"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Address *"
                  placeholderTextColor="#999"
                  value={address}
                  onChangeText={setAddress}
                  multiline
                  numberOfLines={2}
                />
              </View>

              {/* Caretaker ID Input (Optional) */}
              <View style={styles.inputContainer}>
                <Ionicons
                  name="medical-outline"
                  size={20}
                  color="#667eea"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Caretaker ID (Optional)"
                  placeholderTextColor="#999"
                  value={caretakerId}
                  onChangeText={setCaretakerId}
                />
              </View>

              <Text style={styles.helperText}>
                * Required fields
              </Text>

              {/* Signup Button */}
              <TouchableOpacity
                style={styles.button}
                onPress={handleSignup}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={["#667eea", "#764ba2"]}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.buttonText}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Text>
                  {!isLoading && (
                    <Ionicons
                      name="arrow-forward"
                      size={20}
                      color="#fff"
                      style={styles.buttonIcon}
                    />
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Sign In Link */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  Already have an account?{" "}
                  <Text
                    style={styles.link}
                    onPress={() => router.replace("/Login/index" as any)}
                  >
                    Sign In
                  </Text>
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
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
    marginBottom: 40,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 30,
    padding: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  passwordInput: {
    flex: 1,
  },
  textArea: {
    minHeight: 60,
    textAlignVertical: "top",
  },
  eyeIcon: {
    padding: 5,
  },
  helperText: {
    fontSize: 12,
    color: "#999",
    marginBottom: 20,
    marginTop: -5,
  },
  button: {
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonIcon: {
    marginLeft: 5,
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    color: "#666",
    fontSize: 14,
  },
  link: {
    color: "#667eea",
    fontWeight: "bold",
  },
})
