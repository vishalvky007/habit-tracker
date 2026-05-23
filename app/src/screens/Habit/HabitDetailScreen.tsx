import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from '../../services/supabase';
import HabitForm from '../../components/HabitForm';
import { Button, ActivityIndicator } from 'react-native-paper';

type RouteParams = {
  habitId: string;
};

export default function HabitDetailScreen() {
  const navigation = useNavigation();
  const { habitId } = useRoute().params as RouteParams;
  const [habit, setHabit] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('id', habitId)
        .single();
      if (!error && data) setHabit(data);
      setLoading(false);
    })();
  }, [habitId]);

  const handleSuccess = () => navigation.goBack();

  const handleDelete = async () => {
    setDeleting(true);
    const { error } = await supabase.from('habits').delete().eq('id', habitId);
    setDeleting(false);
    if (!error) navigation.goBack();
    else console.error('Delete error', error);
  };

  if (loading) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator /></View>;
  if (!habit) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Habit not found.</Text></View>;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <HabitForm
        initialValues={{
          title: habit.title,
          description: habit.description,
          frequency: habit.frequency,
          start_date: habit.start_date,
        }}
        onSubmitSuccess={handleSuccess}
      />
      <Button
        mode="contained"
        onPress={handleDelete}
        loading={deleting}
        style={{ marginTop: 16 }}
        disabled={deleting}
      >
        Delete Habit
      </Button>
    </View>
  );
}
