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
  ActivityIndicator,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { signupElderly } from "../api/auth"
import { useUser } from "../contexts/UserContext"

export default function SignupElderlyScreen() {
  const router = useRouter()
  const { setUserType, setCurrentUser } = useUser()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [age, setAge] = useState("")
  const [address, setAddress] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Emergency contact state
  const [emergencyContactName, setEmergencyContactName] = useState("")
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("")
  const [emergencyContactRelation, setEmergencyContactRelation] = useState("")

  // Caretaker selection state
  const [caretakers, setCaretakers] = useState<any[]>([])
  const [selectedCaretakerId, setSelectedCaretakerId] = useState<string>("")
  const [isLoadingCaretakers, setIsLoadingCaretakers] = useState(false)

  // Fetch caretakers on component mount
  const fetchCaretakers = async () => {
    setIsLoadingCaretakers(true)
    try {
      const API_URL =
        process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api"
      const response = await fetch(`${API_URL}/users/caretakers`)
      const data = await response.json()

      if (response.ok && data.success) {
        setCaretakers(data.data.caretakers || [])
      }
    } catch (error) {
      console.error("Error fetching caretakers:", error)
      Alert.alert(
        "Connection Error",
        "Unable to connect to the server. Please make sure the backend server is running.\n\nTo start the backend:\n1. Open a terminal\n2. Navigate to ElderlyCareAppBackend\n3. Run: npm start",
        [{ text: "OK" }]
      )
    } finally {
      setIsLoadingCaretakers(false)
    }
  }

  React.useEffect(() => {
    fetchCaretakers()
  }, [])

  const validateForm = () => {
    if (!name || !email || !phone || !password || !age || !address) {
      Alert.alert("Error", "Please fill in all required fields")
      return false
    }

    if (
      !emergencyContactName ||
      !emergencyContactPhone ||
      !emergencyContactRelation
    ) {
      Alert.alert("Error", "Please fill in emergency contact information")
      return false
    }

    if (!selectedCaretakerId) {
      Alert.alert("Error", "Please select a caretaker")
      return false
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters")
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address")
      return false
    }

    const ageNum = parseInt(age)
    if (isNaN(ageNum) || ageNum < 60 || ageNum > 120) {
      Alert.alert("Error", "Age must be between 60 and 120")
      return false
    }

    const phoneRegex = /^[0-9]{10}$/
    if (!phoneRegex.test(phone) || !phoneRegex.test(emergencyContactPhone)) {
      Alert.alert("Error", "Please enter valid 10-digit phone numbers")
      return false
    }

    return true
  }

  const handleSignup = async () => {
    if (!validateForm()) return

    setIsLoading(true)

    try {
      const result = await signupElderly({
        name,
        email,
        phone,
        password,
        age: parseInt(age),
        address,
        caretakerId: selectedCaretakerId,
        emergencyContact: {
          name: emergencyContactName,
          phone: emergencyContactPhone,
          relation: emergencyContactRelation,
        },
      })

      if (result.success && result.user) {
        await setUserType(result.user.userType)
        await setCurrentUser({
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          userType: result.user.userType,
          token: result.user.token,
        })

        Alert.alert("Success", "Account created successfully!", [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)" as any),
          },
        ])
      } else {
        let errorMessage = result.error || "Failed to create account"

        if (errorMessage.includes("already exists")) {
          errorMessage = "An account with this email already exists."
        } else if (errorMessage.includes("Caretaker not found")) {
          errorMessage =
            "Selected caretaker is unavailable. Please choose another."
          fetchCaretakers()
        }

        Alert.alert("Signup Failed", errorMessage)
      }
    } catch (error) {
      console.error("Signup error:", error)
      Alert.alert(
        "Error",
        "Network error. Please check your connection and try again."
      )
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

              {/* Emergency Contact Section */}
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-add-outline"
                  size={20}
                  color="#667eea"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Emergency Contact Name *"
                  placeholderTextColor="#999"
                  value={emergencyContactName}
                  onChangeText={setEmergencyContactName}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="call"
                  size={20}
                  color="#667eea"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Emergency Contact Phone *"
                  placeholderTextColor="#999"
                  value={emergencyContactPhone}
                  onChangeText={setEmergencyContactPhone}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="people-outline"
                  size={20}
                  color="#667eea"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Relation (e.g., Son, Daughter) *"
                  placeholderTextColor="#999"
                  value={emergencyContactRelation}
                  onChangeText={setEmergencyContactRelation}
                  autoCapitalize="words"
                />
              </View>

              {/* Caretaker Selection */}
              {isLoadingCaretakers ? (
                <View
                  style={[styles.inputContainer, { justifyContent: "center" }]}
                >
                  <ActivityIndicator size="small" color="#667eea" />
                  <Text style={{ marginLeft: 10, color: "#666" }}>
                    Loading caretakers...
                  </Text>
                </View>
              ) : caretakers.length > 0 ? (
                <View style={{ marginBottom: 15 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#666",
                      marginBottom: 10,
                      fontWeight: "bold",
                    }}
                  >
                    Select Caretaker *
                  </Text>
                  {caretakers.map((caretaker) => (
                    <TouchableOpacity
                      key={caretaker._id}
                      style={{
                        padding: 15,
                        backgroundColor:
                          selectedCaretakerId === caretaker._id
                            ? "#e8f0fe"
                            : "#f8f9fa",
                        borderRadius: 15,
                        marginBottom: 10,
                        borderWidth:
                          selectedCaretakerId === caretaker._id ? 2 : 0,
                        borderColor: "#667eea",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                      onPress={() => setSelectedCaretakerId(caretaker._id)}
                    >
                      <Ionicons
                        name="medical-outline"
                        size={24}
                        color={
                          selectedCaretakerId === caretaker._id
                            ? "#667eea"
                            : "#999"
                        }
                        style={{ marginRight: 12 }}
                      />
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            color: "#333",
                          }}
                        >
                          {caretaker.name}
                        </Text>
                        <Text style={{ fontSize: 14, color: "#666" }}>
                          Experience: {caretaker.experience} years
                        </Text>
                      </View>
                      {selectedCaretakerId === caretaker._id && (
                        <Ionicons
                          name="checkmark-circle"
                          size={24}
                          color="#667eea"
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Text style={{ fontSize: 14, color: "#999", marginBottom: 15 }}>
                  No caretakers available. Please contact support.
                </Text>
              )}

              <Text style={styles.helperText}>* Required fields</Text>

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
                    onPress={() => router.replace("/Login" as any)}
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
