import { Stack } from "expo-router";
import { UserProvider } from "../contexts/UserContext";

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Root redirect */}
        <Stack.Screen name="index" />

        {/* Login screen */}
        <Stack.Screen name="Login" />

        {/* Signup screens */}
        <Stack.Screen name="signup-selection" />
        <Stack.Screen name="signup-elderly" />
        <Stack.Screen name="signup-caretaker" />

        {/* User type selection */}
        <Stack.Screen name="user-selection" />

        {/* Caretaker screens */}
        <Stack.Screen name="caretaker-dashboard" />
        <Stack.Screen name="elderly-detail" />

        {/* Tabs (bottom navigation) for elderly users */}
        <Stack.Screen name="(tabs)" />

        {/* Additional screens */}
        <Stack.Screen name="modal" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="mood-results" />
        <Stack.Screen name="music-therapy" />
        <Stack.Screen name="storytelling" />
        <Stack.Screen name="breathing" />
        <Stack.Screen name="yoga" />
        <Stack.Screen name="meditation" />
      </Stack>
    </UserProvider>
  );
}
