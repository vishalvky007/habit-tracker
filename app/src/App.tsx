import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
// NavigationContainer import removed – Expo Router supplies it
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from './services/supabase';
import { NativeModules } from 'react-native';
if (!NativeModules.PlatformConstants) {
  NativeModules.PlatformConstants = {
    isTesting: false,
    reactNativeVersion: { major: 0, minor: 72, patch: 0 },
    platform: 'android',
    // add any fields you might need
  };
}
import AuthStack from './navigation/AuthStack';
import AppStack from './navigation/AppStack';

const Stack = createNativeStackNavigator();

export default function App() {
  const [session, setSession] = React.useState<Session | null>(null);

  React.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <PaperProvider>
      <>
        {session ? <AppStack /> : <AuthStack />}
      </>
    </PaperProvider>
  );
}