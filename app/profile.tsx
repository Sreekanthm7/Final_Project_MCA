import React, { useState, useEffect } from "react"
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useUser } from "../contexts/UserContext"

export default function ProfileScreen() {
  const router = useRouter()
  const { logout } = useUser()
  const [isEditing, setIsEditing] = useState(false)

  // User profile data
  const [name, setName] = useState("John Doe")
  const [email, setEmail] = useState("john.doe@example.com")
  const [age, setAge] = useState("75")
  const [phone, setPhone] = useState("+1 234 567 8900")
  const [emergencyContact, setEmergencyContact] = useState("Jane Doe")
  const [emergencyPhone, setEmergencyPhone] = useState("+1 234 567 8901")
  const [address, setAddress] = useState("123 Main St, City, State")

  useEffect(() => {
    loadProfileData()
  }, [])

  const loadProfileData = async () => {
    try {
      const savedName = await AsyncStorage.getItem("userName")
      const savedEmail = await AsyncStorage.getItem("userEmail")
      const savedAge = await AsyncStorage.getItem("userAge")
      const savedPhone = await AsyncStorage.getItem("userPhone")
      const savedEmergencyContact = await AsyncStorage.getItem("emergencyContact")
      const savedEmergencyPhone = await AsyncStorage.getItem("emergencyPhone")
      const savedAddress = await AsyncStorage.getItem("userAddress")

      if (savedName) setName(savedName)
      if (savedEmail) setEmail(savedEmail)
      if (savedAge) setAge(savedAge)
      if (savedPhone) setPhone(savedPhone)
      if (savedEmergencyContact) setEmergencyContact(savedEmergencyContact)
      if (savedEmergencyPhone) setEmergencyPhone(savedEmergencyPhone)
      if (savedAddress) setAddress(savedAddress)
    } catch (error) {
      console.error("Error loading profile data:", error)
    }
  }

  const saveProfileData = async () => {
    try {
      await AsyncStorage.setItem("userName", name)
      await AsyncStorage.setItem("userEmail", email)
      await AsyncStorage.setItem("userAge", age)
      await AsyncStorage.setItem("userPhone", phone)
      await AsyncStorage.setItem("emergencyContact", emergencyContact)
      await AsyncStorage.setItem("emergencyPhone", emergencyPhone)
      await AsyncStorage.setItem("userAddress", address)

      setIsEditing(false)
      Alert.alert("Success", "Profile updated successfully!")
    } catch (error) {
      console.error("Error saving profile data:", error)
      Alert.alert("Error", "Failed to save profile data")
    }
  }

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout()
            router.replace("/user-selection" as any)
          }
        }
      ]
    )
  }

  const getInitials = () => {
    const names = name.split(" ")
    if (names.length >= 2) {
      return names[0][0] + names[1][0]
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity
            onPress={() => isEditing ? saveProfileData() : setIsEditing(true)}
            style={styles.editButton}
          >
            <Ionicons name={isEditing ? "checkmark" : "create"} size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Gravatar/Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={["#f093fb", "#f5576c"]}
              style={styles.avatarGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.avatarText}>{getInitials()}</Text>
            </LinearGradient>
          </View>
          <Text style={styles.profileName}>{name}</Text>
          <Text style={styles.profileEmail}>{email}</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="person" size={20} color="#667eea" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Full Name</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.infoInput}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                  />
                ) : (
                  <Text style={styles.infoValue}>{name}</Text>
                )}
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons name="mail" size={20} color="#667eea" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.infoInput}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                  />
                ) : (
                  <Text style={styles.infoValue}>{email}</Text>
                )}
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons name="calendar" size={20} color="#667eea" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Age</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.infoInput}
                    value={age}
                    onChangeText={setAge}
                    placeholder="Enter your age"
                    keyboardType="numeric"
                  />
                ) : (
                  <Text style={styles.infoValue}>{age} years</Text>
                )}
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons name="call" size={20} color="#667eea" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.infoInput}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Enter your phone"
                    keyboardType="phone-pad"
                  />
                ) : (
                  <Text style={styles.infoValue}>{phone}</Text>
                )}
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons name="location" size={20} color="#667eea" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Address</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.infoInput}
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Enter your address"
                    multiline
                  />
                ) : (
                  <Text style={styles.infoValue}>{address}</Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Emergency Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contact</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="people" size={20} color="#f5576c" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Contact Name</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.infoInput}
                    value={emergencyContact}
                    onChangeText={setEmergencyContact}
                    placeholder="Enter contact name"
                  />
                ) : (
                  <Text style={styles.infoValue}>{emergencyContact}</Text>
                )}
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons name="call" size={20} color="#f5576c" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Contact Phone</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.infoInput}
                    value={emergencyPhone}
                    onChangeText={setEmergencyPhone}
                    placeholder="Enter contact phone"
                    keyboardType="phone-pad"
                  />
                ) : (
                  <Text style={styles.infoValue}>{emergencyPhone}</Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionButtonContent}>
              <Ionicons name="lock-closed" size={20} color="#667eea" />
              <Text style={styles.actionButtonText}>Change Password</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionButtonContent}>
              <Ionicons name="notifications" size={20} color="#667eea" />
              <Text style={styles.actionButtonText}>Notification Settings</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionButtonContent}>
              <Ionicons name="shield-checkmark" size={20} color="#667eea" />
              <Text style={styles.actionButtonText}>Privacy & Security</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LinearGradient
            colors={["#f5576c", "#f093fb"]}
            style={styles.logoutGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="log-out" size={24} color="#fff" />
            <Text style={styles.logoutText}>Logout</Text>
          </LinearGradient>
        </TouchableOpacity>

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
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarSection: {
    alignItems: "center",
  },
  avatarContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#fff",
  },
  avatarText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
  },
  profileName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 15,
  },
  profileEmail: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 5,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 25,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 15,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: "#999",
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  infoInput: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    borderBottomWidth: 1,
    borderBottomColor: "#667eea",
    paddingVertical: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 15,
  },
  actionButton: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    gap: 15,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  logoutButton: {
    borderRadius: 15,
    overflow: "hidden",
    marginTop: 10,
    shadowColor: "#f5576c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    gap: 12,
  },
  logoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
})
