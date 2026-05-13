/**
 * @file Skeleton.js
 * @description Componente de carga tipo "skeleton" con animación de pulso.
 * Se utiliza para crear estados de carga visuales que imitan la estructura del contenido.
 */

import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

/**
 * Componente Skeleton
 * @param {Number|String} width - Ancho del skeleton
 * @param {Number|String} height - Alto del skeleton
 * @param {Number} borderRadius - Radio de los bordes
 * @param {Object} style - Estilos adicionales
 */
const Skeleton = ({
  width,
  height,
  borderRadius = 4,
  style
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  // Configuración de la animación de pulso
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