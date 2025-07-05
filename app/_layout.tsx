import { Stack, Redirect, useSegments } from "expo-router";
import "./global.css";
import { StatusBar } from "react-native";
import { useAuth, AuthProvider } from "@/services/AuthContext";

export default function RootLayoutNav() {
  

  return (
    <>
    <AuthProvider>
      <StatusBar hidden />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="movies/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="auth/Login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/Signup" options={{ headerShown: false }} />
      </Stack>
      </AuthProvider>
    </>
  );
}

