import React from 'react';
import { View } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';

const SkeletonTrendingCard = () => {
  return (
    <View className="w-32 mr-5">
      <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        style={{
          height: 192,
          width: '100%',
          borderRadius: 12,
        }}
      />
      <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        style={{
          height: 16,
          width: '100%',
          borderRadius: 4,
          marginTop: 10,
        }}
      />
    </View>
  );
};

export default SkeletonTrendingCard;
