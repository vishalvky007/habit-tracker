import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { supabase } from '../services/supabase';
import FrequencyPicker from './FrequencyPicker';

type HabitValues = {
  title: string;
  description?: string;
  frequency: any;
  start_date: string;
};

type Props = {
  initialValues?: HabitValues;
  onSubmitSuccess?: () => void;
};

export default function HabitForm({ initialValues, onSubmitSuccess }: Props) {
  const [title, setTitle] = React.useState(initialValues?.title ?? '');
  const [description, setDescription] = React.useState(initialValues?.description ?? '');
  const [frequency, setFrequency] = React.useState<any>(initialValues?.frequency ?? { type: 'daily' });
  const [startDate, setStartDate] = React.useState(initialValues?.start_date ?? new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = React.useState(false);

  const handleSave = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('habits').insert({
      title,
      description,
      frequency,
      start_date: startDate,
    });
    setLoading(false);
    if (!error && data) {
      if (onSubmitSuccess) onSubmitSuccess();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput label="Title" value={title} onChangeText={setTitle} />
      <TextInput label="Description" value={description} onChangeText={setDescription} />
      <FrequencyPicker value={frequency} onChange={setFrequency} />
      <TextInput label="Start Date" value={startDate} onChangeText={setStartDate} />
      <Button mode="contained" onPress={handleSave} loading={loading} style={styles.button}>
        Save
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  button: { marginTop: 16 },
});
