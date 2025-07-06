// Dot.tsx
import React from 'react';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';

interface DotProps {
  index: number;
  progressValue: Animated.SharedValue<number>;
}

const Dot: React.FC<DotProps> = ({ index, progressValue }) => {
  const animatedDotStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      progressValue.value,
      [index - 1, index, index + 1],
      [0.3, 1, 0.3],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }
    );

    const scale = interpolate(
      progressValue.value,
      [index - 1, index, index + 1],
      [1, 1.4, 1],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }
    );

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: 'white',
          marginHorizontal: 4,
        },
        animatedDotStyle,
      ]}
    />
  );
};

export default Dot;
