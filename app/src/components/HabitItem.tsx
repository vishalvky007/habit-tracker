import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { supabase } from '../services/supabase';

export type Habit = {
  id: string;
  title: string;
  description?: string;
  frequency: any;
  start_date: string;
  created_at: string;
  updated_at: string;
};

type Props = {
  habit: Habit;
  onToggle?: () => void;
  onPress?: () => void;
};

export default function HabitItem({ habit, onToggle, onPress }: Props) {
  const [checked, setChecked] = React.useState(false);

  const handleToggle = async () => {
    const newChecked = !checked;
    setChecked(newChecked);
    if (newChecked) {
      await supabase.from('habit_logs').insert({
        habit_id: habit.id,
        logged_date: new Date().toISOString().split('T')[0],
      });
    }
    if (onToggle) onToggle();
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container} disabled={!onPress} accessibilityLabel="Habit item">
      <Text style={styles.title}>{habit.title}</Text>
      <Checkbox status={checked ? 'checked' : 'unchecked'} onPress={handleToggle} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  title: { fontSize: 16 },
});
