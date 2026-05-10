import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HabitListScreen from '../screens/Home/HabitListScreen';
import CalendarScreen from '../screens/Home/CalendarScreen';
import SettingsScreen from '../screens/SettingsScreen';

export type HomeTabParamList = {
  HabitList: undefined;
  Calendar: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<HomeTabParamList>();

export default function HomeTabs() {
  return (
    <Tab.Navigator
      initialRouteName="HabitList"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName = '';
          if (route.name === 'HabitList') {
            iconName = 'format-list-checks';
          } else if (route.name === 'Calendar') {
            iconName = 'calendar-month';
          } else if (route.name === 'Settings') {
            iconName = 'cog';
          }
          return <MaterialCommunityIcons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="HabitList" component={HabitListScreen} options={{ title: 'Habits' }} />
      <Tab.Screen name="Calendar" component={CalendarScreen} options={{ title: 'Calendar' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
}
