import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function AddHabitScreen() {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Add Habit Screen (placeholder)</Text>
      <Button mode="contained" onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
        Close
      </Button>
    </View>
  );
}
