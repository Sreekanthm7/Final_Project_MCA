# API Setup Guide - Elderly Care App

## What Was Created

A complete API authentication system has been set up in your app:

### 📁 Folder Structure

```
ElderlyCareExpoApp/
├── api/
│   ├── auth.ts          # Authentication functions
│   ├── client.ts        # Generic API client
│   ├── config.ts        # API configuration
│   ├── index.ts         # Exports
│   └── README.md        # API documentation
├── app/
│   └── Login.tsx        # Updated with API integration
└── .env.example         # Environment variables template
```

## 🚀 Features

✅ **Login API Integration** - Fully integrated with the Login screen
✅ **Token Management** - Automatic JWT token storage in AsyncStorage
✅ **User Context** - Integrated with UserContext for state management
✅ **Loading States** - Shows spinner during login
✅ **Error Handling** - Proper error messages and alerts
✅ **Type Safety** - Full TypeScript support
✅ **Generic API Client** - Reusable for all API calls

## 📝 How to Use

### 1. Configure API URL

Create a `.env` file in the root directory:

```bash
EXPO_PUBLIC_API_URL=http://your-backend-url.com/api
```

For local development:
```bash
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

### 2. Login Flow

The Login screen (`app/Login.tsx`) now:
- Validates email and password
- Calls the API authentication endpoint
- Stores the auth token automatically
- Navigates to the correct screen based on user type
- Shows loading spinner during authentication

### 3. Using the API in Other Components

```typescript
import { loginUser, signupUser, logoutUser } from "../api/auth";

// Login
const result = await loginUser({ email, password });

// Signup
const result = await signupUser({
  email,
  password,
  name,
  userType: "elderly"
});

// Logout
await logoutUser();
```

### 4. Making Other API Calls

```typescript
import { apiClient } from "../api";

// GET request
const response = await apiClient.get("/user/profile");

// POST request
const response = await apiClient.post("/elderly/mood", {
  mood: "happy"
});
```

## 🔧 Backend Requirements

Your backend needs to implement these endpoints:

### POST /api/auth/login
Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "userType": "elderly",
    "token": "jwt-token-here"
  }
}
```

### POST /api/auth/signup
Request:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "userType": "elderly",
  "age": 70
}
```

Response: Same as login

## 🧪 Testing Without Backend

For testing without a backend, you can modify `api/auth.ts` to return mock data:

```typescript
// In loginUser function, comment out the fetch and return:
return {
  success: true,
  user: {
    id: "test-123",
    email: credentials.email,
    name: "Test User",
    userType: "elderly",
    token: "test-token",
  },
  message: "Login successful",
};
```

## 📚 Available Functions

### Authentication
- `loginUser(credentials)` - Login with email/password
- `signupUser(data)` - Create new account
- `logoutUser()` - Clear session
- `isAuthenticated()` - Check if user is logged in
- `getAuthToken()` - Get stored token
- `getCurrentUser()` - Get user info from storage
- `verifyToken()` - Verify token with backend

### API Client
- `apiClient.get(endpoint)` - GET request
- `apiClient.post(endpoint, body)` - POST request
- `apiClient.put(endpoint, body)` - PUT request
- `apiClient.patch(endpoint, body)` - PATCH request
- `apiClient.delete(endpoint)` - DELETE request

## 🔐 Security Features

- Tokens stored in AsyncStorage (secure on device)
- Automatic token inclusion in API requests
- Request timeout (10 seconds)
- Error handling for network failures
- TypeScript for type safety

## 📱 Next Steps

1. Set up your backend API
2. Configure the API URL in `.env`
3. Test the login flow
4. Implement signup screens with API
5. Add other API endpoints as needed

## 💡 Tips

- Check `api/README.md` for detailed API documentation
- All API calls are async - use await or .then()
- Errors are returned in the response object, not thrown
- Token is automatically added to all requests
- You can access API_CONFIG to customize endpoints

## 🐛 Troubleshooting

**Login not working?**
- Check if API URL is correct in `.env`
- Verify backend is running
- Check network permissions in app.json
- Look at console logs for errors

**Token not persisting?**
- AsyncStorage requires @react-native-async-storage/async-storage package (already installed)
- Check if AsyncStorage.setItem is completing

**Network errors?**
- Enable network permissions in app.json
- For Android, enable cleartext traffic for localhost
- Check if you can reach the API from browser

