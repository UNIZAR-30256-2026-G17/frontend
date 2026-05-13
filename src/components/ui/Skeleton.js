import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

/**
 * A pulse-animated skeleton loader for modern loading states.
 */
export const Skeleton = ({
  width,
  height,
  borderRadius = 4,
  style
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.6,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          opacity,
        },
        style,
      ]}
    />
  );
};

export default Skeleton;
