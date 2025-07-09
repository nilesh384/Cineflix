import { Link } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from "@react-native-masked-view/masked-view";
import { View, Text, TouchableOpacity, Image, Text as RNText, StyleSheet } from "react-native";
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';

import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import React from "react";

const TrendingCard = ({
  movie: { movie_id, title, poster_url, vote_average, media_type },
  index,
}: TrendingCardProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Link
      href={{
        pathname: "/movies/[id]",
        params: {
          id: movie_id,
          type: media_type === "tv" ? "tv" : "movie", // fallback to 'movie'
        },
      }}
      asChild
    >

      <TouchableOpacity
        className="relative pl-3"
        onPressIn={() => (scale.value = withSpring(0.95))}
        onPressOut={() => (scale.value = withSpring(1))}
        activeOpacity={0.8}
      >
        <Animated.View style={animatedStyle} className="w-40">
          <Image
            source={{ uri: poster_url }}
            className="w-full h-60 rounded-xl"
            resizeMode="cover"
          />

          {/* IMDb rating */}
          <View className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded-lg flex-row items-center">
            <Image source={icons.star} className="w-4 h-4" />
            <Text className="text-xs text-white ml-1">
              {vote_average ? vote_average.toFixed(1) : "N/A"}
            </Text>
          </View>

          {media_type === 'tv' && (
            <View className="absolute top-1.5 left-1.5 bg-black px-2 py-1 rounded-md flex-row items-center">
              <Text className="text-xs text-yellow-400">
                {media_type.toUpperCase()}
              </Text>
            </View>
          )}

          {/* Ranking Mask */}
          <View style={styles.rankingWrapper}>
            <MaskedView
              maskElement={
                <RNText style={styles.rankingText}>
                  {index + 1}
                </RNText>
              }
            >
              <LinearGradient
                colors={rankColors[index] || ['#E0E0E0', '#A9A9A9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientBackground}
              />
            </MaskedView>
          </View>
          {/* Title */}
          <Text
            className="text-base font-semibold mt-2 text-white w-full"
            numberOfLines={2}
          >
            {title}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  );

};

import type { ColorValue } from 'react-native';

const rankColors: [ColorValue, ColorValue][] = [
  ['#FFD700', '#FF4500'], // 1st
  ['#C0C0C0', '#999999'], // 2nd
  ['#CD7F32', '#8B4513'], // 3rd
];

const styles = StyleSheet.create({
  rankingWrapper: {
    position: 'absolute',
    bottom: 20,
    left: -8,
    width: 60,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5, // for Android shadow
  },
  rankingText: {
    fontSize: 45,
    fontWeight: '900',
    textAlign: 'left',
    color: 'white',
  },
  gradientBackground: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});


export default React.memo(TrendingCard);
