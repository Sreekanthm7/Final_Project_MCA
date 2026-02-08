import AsyncStorage from "@react-native-async-storage/async-storage"

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api"

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCaretakerData {
  name: string
  email: string
  phone: string
  password: string
  experience: number
}

export interface SignupElderlyData {
  name: string
  email: string
  phone: string
  password: string
  age: number
  address: string
  caretakerId: string
  emergencyContact: {
    name: string
    phone: string
    relation: string
  }
}

export interface AuthResponse {
  success: boolean
  message?: string
  user?: {
    id: string
    email: string
    name: string
    userType: "elderly" | "caretaker"
    token: string
  }
  error?: string
}

/**
 * Transform backend response to frontend format
 * Maps backend 'role' to frontend 'userType'
 * Adds 'id' field from '_id'
 */
const transformAuthResponse = (data: any): AuthResponse => {
  if (!data?.data?.user || !data?.data?.token) {
    return {
      success: false,
      error: data?.message || "Invalid response format",
    }
  }

  const { user, token } = data.data

  return {
    success: data.success,
    message: data.message,
    user: {
      id: user._id || user.id,
      email: user.email,
      name: user.name,
      userType: user.role, // Map 'role' to 'userType'
      token: token,
    },
  }
}

/**
 * Login user with email and password
 */
export const loginUser = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  try {
    console.log("Login attempt for:", credentials.email)
    console.log("API URL:", `${API_URL}/auth/login`)

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    console.log("Response status:", response.status)
    const data = await response.json()
    console.log("Response data:", JSON.stringify(data, null, 2))

    if (response.ok && data.success) {
      console.log("Login successful, transforming response...")
      const transformed = transformAuthResponse(data)
      console.log("Transformed data:", JSON.stringify(transformed, null, 2))

      if (transformed.user) {
        // Store token in AsyncStorage
        await AsyncStorage.setItem("authToken", transformed.user.token)
        await AsyncStorage.setItem("userId", transformed.user.id)
        await AsyncStorage.setItem("userType", transformed.user.userType)

        return {
          success: true,
          user: transformed.user,
          message: "Login successful",
        }
      } else {
        console.error("Transformed user is undefined")
        return {
          success: false,
          error: "Failed to process user data",
        }
      }
    }

    console.error("Login failed:", data.message)
    return {
      success: false,
      error: data.message || "Login failed",
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Network error. Please try again.",
    }
  }
}

/**
 * Sign up new user
 */
export const signupCaretaker = async (
  signupCaretakerData: SignupCaretakerData
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/register-caretaker`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signupCaretakerData),
    })

    const data = await response.json()

    if (response.ok && data.success) {
      const transformed = transformAuthResponse(data)

      if (transformed.user) {
        // Store token in AsyncStorage
        await AsyncStorage.setItem("authToken", transformed.user.token)
        await AsyncStorage.setItem("userId", transformed.user.id)
        await AsyncStorage.setItem("userType", transformed.user.userType)

        return {
          success: true,
          user: transformed.user,
          message: "Signup successful",
        }
      }
    }

    // Handle validation errors array
    let errorMessage = data.message || "Signup failed"
    if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      errorMessage = data.errors.join(". ")
    }

    return {
      success: false,
      error: errorMessage,
    }
  } catch (error) {
    console.error("Signup error:", error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Network error. Please try again.",
    }
  }
}

//signup elderly user

export const signupElderly = async (
  signupElderlyData: SignupElderlyData
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/register-elderly`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signupElderlyData),
    })

    const data = await response.json()

    if (response.ok && data.success) {
      const transformed = transformAuthResponse(data)

      if (transformed.user) {
        // Store token in AsyncStorage
        await AsyncStorage.setItem("authToken", transformed.user.token)
        await AsyncStorage.setItem("userId", transformed.user.id)
        await AsyncStorage.setItem("userType", transformed.user.userType)

        return {
          success: true,
          user: transformed.user,
          message: "Signup successful",
        }
      }
    }

    // Handle validation errors array
    let errorMessage = data.message || "Signup failed"
    if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      errorMessage = data.errors.join(". ")
    }

    return {
      success: false,
      error: errorMessage,
    }
  } catch (error) {
    console.error("Signup error:", error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Network error. Please try again.",
    }
  }
}

/**
 * Logout user
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem("authToken")
    await AsyncStorage.removeItem("userId")
    await AsyncStorage.removeItem("userType")
  } catch (error) {
    console.error("Logout error:", error)
  }
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem("authToken")
    return token !== null
  } catch (error) {
    console.error("Auth check error:", error)
    return false
  }
}

/**
 * Get stored auth token
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem("authToken")
  } catch (error) {
    console.error("Get token error:", error)
    return null
  }
}

/**
 * Get current user info from storage
 */
export const getCurrentUser = async (): Promise<{
  id: string
  userType: "elderly" | "caretaker"
} | null> => {
  try {
    const userId = await AsyncStorage.getItem("userId")
    const userType = await AsyncStorage.getItem("userType")

    if (userId && userType) {
      return {
        id: userId,
        userType: userType as "elderly" | "caretaker",
      }
    }
    return null
  } catch (error) {
    console.error("Get user error:", error)
    return null
  }
}

/**
 * Verify auth token with backend
 */
export const verifyToken = async (): Promise<boolean> => {
  try {
    const token = await getAuthToken()
    if (!token) return false

    const response = await fetch(`${API_URL}/auth/verify`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    return response.ok
  } catch (error) {
    console.error("Token verification error:", error)
    return false
  }
}
