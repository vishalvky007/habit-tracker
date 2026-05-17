import React from 'react';
import { View, Text } from 'react-native';
import { useHabits } from '../../hooks/useHabits';

export default function HabitListScreen() {
  const { habits, loading, error } = useHabits();

  if (loading) return <View><Text>Loading habits...</Text></View>;
  if (error) return <View><Text>Error: {error}</Text></View>;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Your Habits</Text>
      {habits.length === 0 ? (
        <Text>No habits yet.</Text>
      ) : (
        habits.map(h => (
          <View key={h.id} style={{ marginBottom: 8 }}>
            <Text>{h.title}</Text>
          </View>
        ))
      )}
    </View>
  );
}
