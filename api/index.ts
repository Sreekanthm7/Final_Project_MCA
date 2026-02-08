/**
 * API Module Exports
 * Central export point for all API functionality
 */

// Auth
export {
  loginUser,
  logoutUser,
  isAuthenticated,
  getAuthToken,
  getCurrentUser,
  verifyToken,
} from "./auth";

export type {
  LoginCredentials,
  AuthResponse,
} from "./auth";

// API Client
export { apiClient } from "./client";
export type { ApiError, ApiResponse } from "./client";

// Config
export { API_CONFIG, getApiUrl, getHeaders } from "./config";
