import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';

type RouteParams = {
  habitId: string;
};

export default function HabitDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { habitId } = (route.params as RouteParams) || {};
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Habit Detail Screen (placeholder)</Text>
      <Text>Habit ID: {habitId}</Text>
      <Button mode="contained" onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
        Close
      </Button>
    </View>
  );
}
