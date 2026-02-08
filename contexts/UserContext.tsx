import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

export type UserType = "elderly" | "caretaker" | null

export interface ElderlyUser {
  id: string
  name: string
  age: number
  profileImage?: string
  lastActive: string
  currentMood?: "happy" | "sad" | "neutral"
  healthStatus: "good" | "fair" | "needs-attention"
  recentActivities: string[]
  moodHistory: {
    date: string
    mood: "happy" | "sad" | "neutral"
    notes?: string
  }[]
  vitalSigns?: {
    heartRate?: number
    bloodPressure?: string
    temperature?: number
  }
}

export interface CaretakerUser {
  id: string
  name: string
  email: string
  elderlyUsers: ElderlyUser[]
}

export interface BasicUser {
  id: string
  name: string
  email: string
  userType: "elderly" | "caretaker"
  token?: string
}

interface UserContextType {
  userType: UserType
  currentUser: BasicUser | CaretakerUser | null
  isLoading: boolean
  isInitialized: boolean
  setUserType: (type: UserType) => Promise<void>
  setCurrentUser: (user: BasicUser | CaretakerUser | null) => Promise<void>
  logout: () => Promise<void>
  restoreSession: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userType, setUserTypeState] = useState<UserType>(null)
  const [currentUser, setCurrentUserState] = useState<BasicUser | CaretakerUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  const setUserType = async (type: UserType) => {
    setUserTypeState(type)
    if (type) {
      await AsyncStorage.setItem("userType", type)
    }
  }

  const setCurrentUser = async (user: BasicUser | CaretakerUser | null) => {
    setCurrentUserState(user)
    if (user) {
      await AsyncStorage.setItem("currentUser", JSON.stringify(user))
    } else {
      await AsyncStorage.removeItem("currentUser")
    }
  }

  const logout = async () => {
    setUserTypeState(null)
    setCurrentUserState(null)
    // Remove all auth-related data from AsyncStorage
    await AsyncStorage.removeItem("authToken")
    await AsyncStorage.removeItem("userId")
    await AsyncStorage.removeItem("userType")
    await AsyncStorage.removeItem("currentUser")
  }

  const restoreSession = async () => {
    try {
      setIsLoading(true)

      // Check for auth token
      const token = await AsyncStorage.getItem("authToken")
      const storedUserType = await AsyncStorage.getItem("userType") as UserType
      const storedUser = await AsyncStorage.getItem("currentUser")

      if (token && storedUserType) {
        // Restore user session
        setUserTypeState(storedUserType)

        if (storedUser) {
          setCurrentUserState(JSON.parse(storedUser))
        }
      }
    } catch (error) {
      console.error("Error restoring session:", error)
      // Clear invalid session data
      await logout()
    } finally {
      setIsLoading(false)
      setIsInitialized(true)
    }
  }

  // Restore session on mount
  useEffect(() => {
    restoreSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <UserContext.Provider
      value={{
        userType,
        currentUser,
        isLoading,
        isInitialized,
        setUserType,
        setCurrentUser,
        logout,
        restoreSession,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
