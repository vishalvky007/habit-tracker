import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeTabs from './HomeTabs';
import AddHabitScreen from '../screens/Habit/AddHabitScreen';
import HabitDetailScreen from '../screens/Habit/HabitDetailScreen';

export type AppStackParamList = {
  HomeTabs: undefined;
  AddHabit: undefined;
  HabitDetail: { habitId: string };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeTabs" component={HomeTabs} />
      <Stack.Screen name="AddHabit" component={AddHabitScreen} />
      <Stack.Screen name="HabitDetail" component={HabitDetailScreen} />
    </Stack.Navigator>
  );
}
