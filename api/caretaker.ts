import AsyncStorage from "@react-native-async-storage/async-storage"
import { API_CONFIG } from "./config"
import { CaretakerUser, ElderlyUser } from "../contexts/UserContext"

const API_URL = API_CONFIG.BASE_URL

export interface CaretakerDashboardResponse {
  success: boolean
  data?: CaretakerUser
  message?: string
  error?: string
}

/**
 * Fetch caretaker dashboard data including assigned elderly users
 */
export const fetchCaretakerDashboard = async (): Promise<CaretakerDashboardResponse> => {
  try {
    const token = await AsyncStorage.getItem("authToken")

    if (!token) {
      return {
        success: false,
        error: "Not authenticated"
      }
    }

    const response = await fetch(`${API_URL}/caretaker/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })

    const data = await response.json()

    if (response.ok && data.success) {
      return {
        success: true,
        data: data.data,
        message: data.message
      }
    }

    return {
      success: false,
      error: data.message || "Failed to fetch dashboard data"
    }
  } catch (error) {
    console.error("Fetch dashboard error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error"
    }
  }
}

/**
 * Fetch list of elderly users assigned to caretaker
 */
export const fetchElderlyUsers = async (): Promise<{
  success: boolean
  data?: ElderlyUser[]
  error?: string
}> => {
  try {
    const token = await AsyncStorage.getItem("authToken")

    if (!token) {
      return {
        success: false,
        error: "Not authenticated"
      }
    }

    const response = await fetch(`${API_URL}/caretaker/elderly-users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })

    const data = await response.json()

    if (response.ok && data.success) {
      return {
        success: true,
        data: data.data
      }
    }

    return {
      success: false,
      error: data.message || "Failed to fetch elderly users"
    }
  } catch (error) {
    console.error("Fetch elderly users error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error"
    }
  }
}
