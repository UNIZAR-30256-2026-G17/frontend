/**
 * @file FadeInView.js
 * @description Componente reutilizable para manejar animaciones de entrada (desvanecimiento y deslizamiento) de elementos de la interfaz.
 */
import React, { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

const FadeInView = ({
  children,
  delay = 0,
  duration = 600,
  translateY = 20,
  style
}) => {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(translateY)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: duration,
        delay: delay,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        delay: delay,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
    ]).start();
  }, [delay, duration, translateY, opacityAnim, slideAnim]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: opacityAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

export default FadeInView;
