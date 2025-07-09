import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from "expo-router";
import "./global.css";
import { StatusBar } from "react-native";
import { useAuth, AuthProvider } from "@/services/AuthContext";

export default function RootLayoutNav() {


  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <StatusBar hidden={true} />
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="movies/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="people/[personId]" options={{ headerShown: false }} />
            <Stack.Screen name="auth/Login" options={{ headerShown: false }} />
            <Stack.Screen name="auth/Signup" options={{ headerShown: false }} />
          </Stack>
        </AuthProvider>
      </GestureHandlerRootView>
    </>
  );
}

