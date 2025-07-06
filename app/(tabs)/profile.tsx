import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useAuth } from "@/services/AuthContext";
import { Redirect, router } from "expo-router";

export default function Profile() {
  const { user, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    try {
      Alert.alert(
        "Logout",
        "Are you sure you want to logout?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Logout",
            onPress: async () => {
              router.push("/(tabs)/home");
              await logout();
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Something went wrong during logout.");
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <ActivityIndicator size="large" color="#fff" />
        <Text className="text-white mt-4">Loading profile...</Text>
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/auth/Login" />;
  }

  return (
    <View className="flex-1 bg-primary items-center justify-center px-6">
      <Image
        source={{ uri: `https://api.dicebear.com/7.x/fun-emoji/png?seed=${user.name}` }}
        className="w-28 h-28 rounded-full mb-6"
        resizeMode="cover"
      />
      <Text className="text-white text-xl font-bold">{user.name}</Text>
      <Text className="text-accent text-base mb-4">{user.email}</Text>

      <View className="bg-secondary p-4 rounded-xl w-full mt-8">
        <Text className="text-white text-[15px]">User ID</Text>
        <Text className="text-gray-400 italic text-[12px] mt-1 break-words">
          {user.$id}
        </Text>
        <Text className="text-white text-[15px] mt-2">Joined on</Text>
        <Text className="text-gray-400 italic text-[12px] mt-1 break-words">
          {user.$createdAt
            && new Date(user.$createdAt).toLocaleDateString()}
        </Text>
        <Text className="text-white text-[15px] mt-2">Phone</Text>
        <Text className="text-gray-400 italic text-[12px] mt-1 break-words">
          {user.phone || "Not provided"}
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleLogout}
        className="bg-red-600 mt-10 px-6 py-3 rounded-full"
      >
        <Text className="text-white font-semibold text-base">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
