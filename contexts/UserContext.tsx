import React, { createContext, useContext, useState, ReactNode } from "react"
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

interface UserContextType {
  userType: UserType
  currentUser: CaretakerUser | null
  setUserType: (type: UserType) => Promise<void>
  setCurrentUser: (user: CaretakerUser | null) => void
  logout: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userType, setUserTypeState] = useState<UserType>(null)
  const [currentUser, setCurrentUser] = useState<CaretakerUser | null>(null)

  const setUserType = async (type: UserType) => {
    setUserTypeState(type)
    if (type) {
      await AsyncStorage.setItem("userType", type)
    }
  }

  const logout = async () => {
    setUserTypeState(null)
    setCurrentUser(null)
    await AsyncStorage.removeItem("userType")
  }

  return (
    <UserContext.Provider
      value={{
        userType,
        currentUser,
        setUserType,
        setCurrentUser,
        logout,
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
