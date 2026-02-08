/**
 * API Configuration
 */

// API Base URL - Update this with your backend URL
export const API_CONFIG = {
  // Development
  DEV_URL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api",

  // Production
  PROD_URL:
    process.env.EXPO_PUBLIC_API_URL || "https://your-api-domain.com/api",

  // Current environment
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api",

  // API endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
      SIGNUP: "/auth/signup",
      LOGOUT: "/auth/logout",
      VERIFY: "/auth/verify",
      REFRESH: "/auth/refresh",
      FORGOT_PASSWORD: "/auth/forgot-password",
      RESET_PASSWORD: "/auth/reset-password",
    },
    USER: {
      PROFILE: "/user/profile",
      UPDATE: "/user/update",
      DELETE: "/user/delete",
    },
    ELDERLY: {
      LIST: "/elderly/list",
      DETAIL: "/elderly/:id",
      UPDATE: "/elderly/:id",
      MOOD: "/elderly/:id/mood",
      ACTIVITIES: "/elderly/:id/activities",
    },
    CARETAKER: {
      DASHBOARD: "/caretaker/dashboard",
      ELDERLY_USERS: "/caretaker/elderly-users",
    },
  },

  // Request timeout in milliseconds
  TIMEOUT: 10000,

  // Retry configuration
  RETRY: {
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
  },
}

/**
 * Get full API URL for an endpoint
 */
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

/**
 * HTTP Headers
 */
export const getHeaders = (token?: string): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  return headers
}
