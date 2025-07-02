import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Link } from "expo-router";
import { Image, ScrollView, Text, View } from "react-native";

export default function Index() {
  return (
    <View className="bg-primary flex-1">
      <Image source={images.bg} className="absolute w-full h-full z-0" />
      <ScrollView className="flex-1 px-5">
        <Image
          source={icons.logo}
          className="absolute w-12 h-10 z-10 mt-20"/>
      </ScrollView>
    </View>
  );
}
