import React from 'react';
import { View } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';

const SkeletonMovieCard = () => {
  return (
    <View className="w-[30%] mb-5 items-center">
      <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        style={{
          height: 160,
          width: '100%',
          borderRadius: 12,
        }}
      />
      <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        style={{
          height: 16,
          width: '90%',
          borderRadius: 4,
          marginTop: 10,
        }}
      />
      <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        style={{
          height: 14,
          width: '60%',
          borderRadius: 4,
          marginTop: 6,
        }}
      />
    </View>
  );
};

export default SkeletonMovieCard;
