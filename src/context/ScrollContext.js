/**
 * @file ScrollContext.js
 * @description Contexto para compartir la posición del scroll vertical (scrollY) 
 * a través de diferentes componentes de la aplicación.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

// Creación del contexto de scroll
const ScrollContext = createContext({
  scrollY: 0,
  setScrollY: () => {},
});

/**
 * Proveedor del contexto de scroll
 */
export const ScrollProvider = ({ children }) => {
  const [scrollY, setScrollY] = useState(0);

  /**
   * Manejador de evento de scroll para actualizar la posición global
   */
  const handleScroll = useCallback((event) => {
    const y = event.nativeEvent.contentOffset.y;
    setScrollY(y);
  }, []);

  return (
    <ScrollContext.Provider value={{ scrollY, setScrollY, handleScroll }}>
      {children}
    </ScrollContext.Provider>
  );
};

/**
 * Hook personalizado para acceder fácilmente al contexto de scroll
 */
export const useScroll = () => useContext(ScrollContext);
