import { Tabs, Redirect, useSegments } from "expo-router";
import { useAuth } from "@/services/AuthContext";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { View, Text, Image, ImageBackground } from "react-native";

const protectedTabs = ["search", "saved", "profile"];

const TabIcon = ({ icon, title, focused }: any) => {
  if (focused) {
    return (
      <ImageBackground
        source={images.highlight}
        className="flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 8,
        }}
      >
        <Image source={icon} tintColor="#151312" className="size-5" />
        <Text className="text-secondary text-base font-semibold ml-2">
          {title}
        </Text>
      </ImageBackground>
    );
  } else {
    return (
      <View className="flex flex-row w-full flex-1 min-w-[112px] min-h-14 mt-4 justify-center items-center rounded-full overflow-hidden">
        <Image source={icon} tintColor="#ffffff" className="size-5" />
      </View>
    );
  }
};

export default function TabsLayout() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();

  const currentTab = segments[1]; // because segments = ["(tabs)", "search"] for example

  if (isLoading) return null;

  if (!user && currentTab && protectedTabs.includes(currentTab)) {
    return <Redirect href="/auth/Signup" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          minWidth: 80,
          maxWidth: 120,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarStyle: {
          backgroundColor: "#0f0d23",
          borderRadius: 30,
          marginHorizontal: 10,
          marginBottom: 20,
          height: 55,
          position: "absolute",
          overflow: "hidden",
          borderWidth: 0,
          borderColor: "#0f0d23",
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
        },
      }}
    >
      <Tabs.Screen name="home" options={{
        title: 'Home',
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon focused={focused} icon={icons.home} title="Home" />
        ),
      }} />
      <Tabs.Screen name="search" options={{
        title: 'Search',
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon focused={focused} icon={icons.search} title="Search" />
        ),
      }} />
      <Tabs.Screen name="saved" options={{
        title: 'Saved',
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon focused={focused} icon={icons.save} title="Saved" />
        ),
      }} />
      <Tabs.Screen name="profile" options={{
        title: 'Profile',
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon focused={focused} icon={icons.person} title="Profile" />
        ),
      }} />
    </Tabs>
  );
}
