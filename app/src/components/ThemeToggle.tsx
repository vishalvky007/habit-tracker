import React, { useContext } from 'react';
import { Switch, Text } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { Provider as PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { ThemeContext } from '../theme/ThemeContext'; // We'll create a simple ThemeContext

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <View style={styles.container}>
      <Text>Dark Theme</Text>
      <Switch value={isDark} onValueChange={toggleTheme} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 8 },
});
