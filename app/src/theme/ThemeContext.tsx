import React, { createContext, useState, useMemo, ReactNode } from 'react';
import { MD3DarkTheme, MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => setIsDark((prev) => !prev);

  const theme = useMemo(() => (isDark ? MD3DarkTheme : MD3LightTheme), [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
};
