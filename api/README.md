# API Documentation

This folder contains all API-related code for authentication and backend communication.

## Structure

```
api/
├── auth.ts          # Authentication functions (login, signup, logout)
├── client.ts        # Generic API client for HTTP requests
├── config.ts        # API configuration and endpoints
├── index.ts         # Central export point
└── README.md        # This file
```

## Setup

1. **Configure your API URL**:
   - Copy `.env.example` to `.env` in the root directory
   - Update `EXPO_PUBLIC_API_URL` with your backend URL

2. **Environment Variables**:
   ```bash
   EXPO_PUBLIC_API_URL=http://your-backend-url.com/api
   ```

## Usage

### Authentication

```typescript
import { loginUser, signupUser, logoutUser } from "@/api";

// Login
const result = await loginUser({
  email: "user@example.com",
  password: "password123"
});

if (result.success) {
  console.log("Logged in:", result.user);
} else {
  console.error("Login failed:", result.error);
}

// Signup
const signupResult = await signupUser({
  email: "user@example.com",
  password: "password123",
  name: "John Doe",
  userType: "elderly",
  age: 70
});

// Logout
await logoutUser();
```

### Generic API Calls

```typescript
import { apiClient } from "@/api";

// GET request
const response = await apiClient.get("/user/profile");

// POST request
const response = await apiClient.post("/elderly/mood", {
  mood: "happy",
  notes: "Feeling great today!"
});

// PUT request
const response = await apiClient.put("/user/update", {
  name: "New Name"
});

// DELETE request
const response = await apiClient.delete("/user/delete");
```

### Check Authentication

```typescript
import { isAuthenticated, getAuthToken, getCurrentUser } from "@/api";

// Check if user is logged in
const authenticated = await isAuthenticated();

// Get auth token
const token = await getAuthToken();

// Get current user info
const user = await getCurrentUser();
```

## API Endpoints

All endpoints are configured in `config.ts`:

- **Auth**: `/auth/login`, `/auth/signup`, `/auth/verify`
- **User**: `/user/profile`, `/user/update`
- **Elderly**: `/elderly/list`, `/elderly/:id`
- **Caretaker**: `/caretaker/dashboard`, `/caretaker/elderly-users`

## Backend Requirements

Your backend should implement these endpoints and return responses in this format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field": ["error1", "error2"]
  }
}
```

### Auth Response
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name",
    "userType": "elderly",
    "token": "jwt-token-here"
  }
}
```

## Features

- ✅ Automatic token management (stored in AsyncStorage)
- ✅ Request timeout handling (10 seconds)
- ✅ Error handling and retry logic
- ✅ TypeScript support with full type definitions
- ✅ Centralized configuration
- ✅ Generic API client for all HTTP methods

## Development

For local development without a backend, you can mock the API responses in the auth functions or create a mock server.
