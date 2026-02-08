import React, { useState, useEffect } from "react"
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useUser } from "../contexts/UserContext"

interface UserProfile {
  _id: string
  name: string
  email: string
  phone: string
  role: "elderly" | "caretaker"
  age?: number
  address?: string
  emergencyContact?: {
    name: string
    phone: string
    relation: string
  }
  experience?: number
  specialization?: string
  healthStatus?: string
  currentMood?: string
  caretakerId?: {
    name: string
    email: string
    phone: string
  }
}

export default function ProfileScreen() {
  const router = useRouter()
  const { logout } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)

  // Editable fields
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [age, setAge] = useState("")
  const [address, setAddress] = useState("")
  const [emergencyContactName, setEmergencyContactName] = useState("")
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("")
  const [emergencyContactRelation, setEmergencyContactRelation] = useState("")
  const [experience, setExperience] = useState("")
  const [specialization, setSpecialization] = useState("")

  useEffect(() => {
    fetchProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchProfile = async () => {
    setIsLoading(true)
    try {
      const token = await AsyncStorage.getItem("authToken")
      if (!token) {
        Alert.alert("Session Expired", "Please login again.")
        router.replace("/Login" as any)
        return
      }

      const API_URL =
        process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api"
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok && data.success && data.data?.user) {
        const user = data.data.user
        setProfile(user)
        setName(user.name || "")
        setPhone(user.phone || "")
        setAge(user.age?.toString() || "")
        setAddress(user.address || "")
        setEmergencyContactName(user.emergencyContact?.name || "")
        setEmergencyContactPhone(user.emergencyContact?.phone || "")
        setEmergencyContactRelation(user.emergencyContact?.relation || "")
        setExperience(user.experience?.toString() || "")
        setSpecialization(user.specialization || "")
      } else {
        Alert.alert("Error", "Failed to load profile data")
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      Alert.alert("Error", "Unable to connect to the server")
    } finally {
      setIsLoading(false)
    }
  }

  const saveProfile = async () => {
    setIsSaving(true)
    try {
      const token = await AsyncStorage.getItem("authToken")
      if (!token || !profile) return

      const API_URL =
        process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api"

      const updates: any = { name, phone }

      if (profile.role === "elderly") {
        updates.age = parseInt(age)
        updates.address = address
        updates.emergencyContact = {
          name: emergencyContactName,
          phone: emergencyContactPhone,
          relation: emergencyContactRelation,
        }
      } else {
        updates.experience = parseInt(experience)
        updates.specialization = specialization
      }

      const response = await fetch(`${API_URL}/users/${profile._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setIsEditing(false)
        Alert.alert("Success", "Profile updated successfully!")
        fetchProfile()
      } else {
        Alert.alert(
          "Error",
          data.message || "Failed to update profile"
        )
      }
    } catch (error) {
      console.error("Error saving profile:", error)
      Alert.alert("Error", "Failed to save profile data")
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout()
          router.replace("/Login" as any)
        },
      },
    ])
  }

  const getInitials = () => {
    if (!name) return "?"
    const names = name.split(" ")
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profile</Text>
            <View style={{ width: 44 }} />
          </View>
        </LinearGradient>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
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
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity
            onPress={() => (isEditing ? saveProfile() : setIsEditing(true))}
            style={styles.editButton}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons
                name={isEditing ? "checkmark" : "create"}
                size={24}
                color="#fff"
              />
            )}
          </TouchableOpacity>
        </View>

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
          <Text style={styles.profileEmail}>{profile?.email}</Text>
          <View style={styles.roleBadge}>
            <Ionicons
              name={profile?.role === "caretaker" ? "medical" : "person"}
              size={14}
              color="#fff"
            />
            <Text style={styles.roleBadgeText}>
              {profile?.role === "caretaker" ? "Caretaker" : "Elderly User"}
            </Text>
          </View>
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
                <Text style={styles.infoValue}>{profile?.email}</Text>
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

            {/* Elderly-specific fields */}
            {profile?.role === "elderly" && (
              <>
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
              </>
            )}

            {/* Caretaker-specific fields */}
            {profile?.role === "caretaker" && (
              <>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Ionicons name="briefcase" size={20} color="#667eea" />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Experience</Text>
                    {isEditing ? (
                      <TextInput
                        style={styles.infoInput}
                        value={experience}
                        onChangeText={setExperience}
                        placeholder="Years of experience"
                        keyboardType="numeric"
                      />
                    ) : (
                      <Text style={styles.infoValue}>
                        {experience} years
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Ionicons name="medkit" size={20} color="#667eea" />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Specialization</Text>
                    {isEditing ? (
                      <TextInput
                        style={styles.infoInput}
                        value={specialization}
                        onChangeText={setSpecialization}
                        placeholder="Your specialization"
                      />
                    ) : (
                      <Text style={styles.infoValue}>
                        {specialization || "Not specified"}
                      </Text>
                    )}
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Emergency Contact - only for elderly */}
        {profile?.role === "elderly" && (
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
                      value={emergencyContactName}
                      onChangeText={setEmergencyContactName}
                      placeholder="Enter contact name"
                    />
                  ) : (
                    <Text style={styles.infoValue}>
                      {emergencyContactName || "Not set"}
                    </Text>
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
                      value={emergencyContactPhone}
                      onChangeText={setEmergencyContactPhone}
                      placeholder="Enter contact phone"
                      keyboardType="phone-pad"
                    />
                  ) : (
                    <Text style={styles.infoValue}>
                      {emergencyContactPhone || "Not set"}
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Ionicons name="heart" size={20} color="#f5576c" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Relation</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.infoInput}
                      value={emergencyContactRelation}
                      onChangeText={setEmergencyContactRelation}
                      placeholder="e.g., Son, Daughter"
                    />
                  ) : (
                    <Text style={styles.infoValue}>
                      {emergencyContactRelation || "Not set"}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Assigned Caretaker - only for elderly */}
        {profile?.role === "elderly" && profile.caretakerId && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Assigned Caretaker</Text>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Ionicons name="medical" size={20} color="#43e97b" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Caretaker Name</Text>
                  <Text style={styles.infoValue}>
                    {profile.caretakerId.name}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Ionicons name="mail" size={20} color="#43e97b" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>
                    {profile.caretakerId.email}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Ionicons name="call" size={20} color="#43e97b" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>
                    {profile.caretakerId.phone}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

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
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
    gap: 6,
  },
  roleBadgeText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
})
