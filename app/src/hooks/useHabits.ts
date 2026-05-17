import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import type { Session, User } from '@supabase/supabase-js';

export type Habit = {
  id: string;
  title: string;
  description?: string;
  frequency: any; // JSON stored in DB
  start_date: string;
  created_at: string;
  updated_at: string;
};

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHabits = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('habits').select('*');
    if (error) setError(error.message);
    else setHabits(data as Habit[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchHabits();
    const subscription = supabase
      .channel('public:habits')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'habits' }, payload => {
        // Simple approach: refetch on any change
        fetchHabits();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return { habits, loading, error, refetch: fetchHabits };
}
