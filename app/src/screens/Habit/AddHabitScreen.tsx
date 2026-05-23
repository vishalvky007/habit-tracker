import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HabitForm from '../../components/HabitForm';

export default function AddHabitScreen() {
  const navigation = useNavigation();
  const handleSuccess = () => navigation.goBack();
  return (
    <View style={{ flex: 1 }}>
      <HabitForm onSubmitSuccess={handleSuccess} />
    </View>
  );
}
