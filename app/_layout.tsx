import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Login screen comes first */}
      <Stack.Screen name="Login/index" />

      {/* Tabs (bottom navigation) come after login */}
      <Stack.Screen name="(tabs)" />

      {/* Additional screens */}
      <Stack.Screen name="mood-results" />
      <Stack.Screen name="music-therapy" />
      <Stack.Screen name="storytelling" />
      <Stack.Screen name="breathing" />
      <Stack.Screen name="yoga" />
    </Stack>
  );
}
