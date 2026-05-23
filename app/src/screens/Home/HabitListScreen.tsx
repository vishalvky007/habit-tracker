import React from 'react';
import { View, Text } from 'react-native';
import { useHabits } from '../../hooks/useHabits';
import HabitItem from '../../components/HabitItem';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function HabitListScreen() {
  const navigation = useNavigation();
  const { habits, loading, error } = useHabits();

  if (loading) return <View><Text>Loading habits...</Text></View>;
  if (error) return <View><Text>Error: {error}</Text></View>;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Your Habits</Text>
      <Button mode="contained" onPress={() => navigation.navigate('AddHabit' as any)} style={{ marginBottom: 12 }}>
        Add Habit
      </Button>
      {habits.length === 0 ? (
        <Text>No habits yet.</Text>
      ) : (
        habits.map(h => (
          <HabitItem key={h.id} habit={h} onPress={() => navigation.navigate('HabitDetail' as any, { habitId: h.id })} />
        ))
      )}
    </View>
  );
}
