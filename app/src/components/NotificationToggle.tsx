import React, { useEffect, useState } from 'react';
import { Switch, Text } from 'react-native-paper';
import { View, StyleSheet, Platform } from 'react-native';
// expo-notifications is imported lazily to avoid runtime errors in Expo Go

import Constants from 'expo-constants';
import { supabase } from '../services/supabase';

// Helper to request permissions and get Expo push token
const registerForPushNotificationsAsync = async (): Promise<string | null> => {
  // Avoid loading expo-notifications in Expo Go
  if (Constants.appOwnership === 'expo') {
    console.log('Push notifications not available in Expo Go');
    return null;
  }
  if (!Constants.isDevice) {
    console.log('Push notifications are only supported on physical devices');
    return null;
  }
  const { default: Notifications } = await import('expo-notifications');
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    console.log('Failed to get push token permission');
    return null;
  }
  const tokenData = await Notifications.getExpoPushTokenAsync();
  return tokenData.data;
};


export default function NotificationToggle() {
  // If running inside Expo Go (appOwnership === 'expo'), skip notification logic
  if (Constants.appOwnership === 'expo') {
    return (
      <View style={styles.container}>
        <Text>Push notifications unavailable in Expo Go.</Text>
      </View>
    );
  }
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync toggle state with Supabase when component mounts
  useEffect(() => {
    const fetchStatus = async () => {
      const { data, error } = await supabase
        .from('push_tokens')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();
      if (!error && data) setEnabled(true);
    };
    fetchStatus();
  }, []);

  const toggle = async () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    if (newEnabled) {
      setLoading(true);
      const token = await registerForPushNotificationsAsync();
      if (token) {
        const { error } = await supabase.from('push_tokens').upsert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          token,
          platform: Platform.OS,
        });
        if (error) console.error('Failed to upsert token', error);
      }
      setLoading(false);
    } else {
      // Remove token on disable
      const { error } = await supabase
        .from('push_tokens')
        .delete()
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
      if (error) console.error('Failed to delete token', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Push Notifications</Text>
      <Switch value={enabled} onValueChange={toggle} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 8 },
});
