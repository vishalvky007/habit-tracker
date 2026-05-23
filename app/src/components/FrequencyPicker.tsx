import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Text } from 'react-native-paper';

type Props = {
  value: any;
  onChange: (val: any) => void;
};

export default function FrequencyPicker({ value, onChange }: Props) {
  const handleChange = (itemValue: string) => {
    // Simple mapping: daily, weekly, custom (placeholder)
    if (itemValue === 'daily') onChange({ type: 'daily' });
    else if (itemValue === 'weekly') onChange({ type: 'weekly', days: [] });
    else onChange({ type: 'custom', config: {} });
  };

  const selected = value?.type || 'daily';

  return (
    <View style={styles.container}>
      <Text>Frequency</Text>
      <Picker selectedValue={selected} onValueChange={handleChange} style={styles.picker}>
        <Picker.Item label="Daily" value="daily" />
        <Picker.Item label="Weekly" value="weekly" />
        <Picker.Item label="Custom" value="custom" />
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  picker: { height: 50, width: '100%' },
});
