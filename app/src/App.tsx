import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { supabase } from './services/supabase';
import AuthStack from './navigation/AuthStack';
import AppStack from './navigation/AppStack';

const Stack = createNativeStackNavigator();

export default function App() {
  const [session, setSession] = React.useState<any>(null);

  React.useEffect(() => {
    // Check for existing session
    const currentSession = supabase.auth.getSession();
    setSession(currentSession);
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <PaperProvider>
      <NavigationContainer>
        {session ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    </PaperProvider>
  );
}
