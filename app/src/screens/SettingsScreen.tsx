import React from 'react';
import { View, Text } from 'react-native';
import ThemeToggle from '../components/ThemeToggle';
import NotificationToggle from '../components/NotificationToggle';

export default function SettingsScreen() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Settings</Text>
      <ThemeToggle />
      <NotificationToggle />
    </View>
  );
}
