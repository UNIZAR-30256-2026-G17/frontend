import React, { createContext, useContext, useState, useCallback } from 'react';

const ScrollContext = createContext({
  scrollY: 0,
  setScrollY: () => {},
});

export const ScrollProvider = ({ children }) => {
  const [scrollY, setScrollY] = useState(0);

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

export const useScroll = () => useContext(ScrollContext);
