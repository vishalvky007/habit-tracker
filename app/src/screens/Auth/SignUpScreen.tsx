import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Text as RNText, ScrollView } from 'react-native';
import { TextInput, HelperText, Snackbar } from 'react-native-paper';
import { supabase } from '../../services/supabase';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function SignUpScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState('');
  const navigation = useNavigation<any>();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (!email.match(/^\S+@\S+\.\S+$/)) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      // Auto‑login after successful sign‑up
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      if (loginError) {
        setError(loginError.message);
      } else {
        setSuccess('Account created and logged in');
        setTimeout(() => navigation.navigate('HomeTabs' as any), 500);
      }
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#A01031', '#1D0D31']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.headerContainer}>
        <RNText style={styles.headerText}>Create Your{'\n'}Account</RNText>
      </View>
      <KeyboardAvoidingView
        style={styles.cardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <TextInput
              label="Full Name"
              value={fullName}
              onChangeText={(text) => { setFullName(text); setError(''); }}
              style={styles.input}
              mode="flat"
              underlineColor="#E0E0E0"
              activeUnderlineColor="#A01031"
              textColor="#333"
              theme={{ colors: { onSurfaceVariant: '#A01031', background: 'transparent' } }}
              right={<TextInput.Icon icon={() => <Ionicons name="checkmark" size={20} color="#A01031" />} />}
            />
            <TextInput
              label="Phone or Gmail"
              value={email}
              onChangeText={(text) => { setEmail(text); setError(''); }}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
              mode="flat"
              underlineColor="#E0E0E0"
              activeUnderlineColor="#A01031"
              textColor="#333"
              theme={{ colors: { onSurfaceVariant: '#A01031', background: 'transparent' } }}
              right={<TextInput.Icon icon={() => <Ionicons name="checkmark" size={20} color="#A01031" />} />}
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={(text) => { setPassword(text); setError(''); }}
              secureTextEntry={!showPassword}
              style={styles.input}
              mode="flat"
              underlineColor="#E0E0E0"
              activeUnderlineColor="#A01031"
              textColor="#333"
              theme={{ colors: { onSurfaceVariant: '#A01031', background: 'transparent' } }}
              right={<TextInput.Icon icon={() => <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#A01031" />} onPress={() => setShowPassword(!showPassword)} />}
            />
            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={(text) => { setConfirmPassword(text); setError(''); }}
              secureTextEntry={!showConfirmPassword}
              style={styles.input}
              mode="flat"
              underlineColor="#E0E0E0"
              activeUnderlineColor="#A01031"
              textColor="#333"
              theme={{ colors: { onSurfaceVariant: '#A01031', background: 'transparent' } }}
              right={<TextInput.Icon icon={() => <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#A01031" />} onPress={() => setShowConfirmPassword(!showConfirmPassword)} />}
            />
            {error ? <HelperText type="error" visible={!!error}>{error}</HelperText> : null}
            
            <TouchableOpacity
              onPress={handleSignUp}
              disabled={!email || !password || !confirmPassword || loading}
              style={styles.buttonWrapper}
            >
              <LinearGradient
                colors={['#A01031', '#1D0D31']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.buttonGradient, (!email || !password || !confirmPassword || loading) && { opacity: 0.7 }]}
              >
                <RNText style={styles.buttonText}>{loading ? 'SIGNING UP...' : 'SIGN UP'}</RNText>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.footerContainer}>
              <RNText style={styles.footerText}>Already have an account? </RNText>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <RNText style={styles.footerLink}>Sign In</RNText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
      <Snackbar
        visible={!!success}
        onDismiss={() => setSuccess('')}
        duration={3000}
      >
        {success}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    paddingTop: 100,
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  headerText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 20,
    flex: 1,
    marginTop: 20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    height: 50,
  },
  buttonWrapper: {
    borderRadius: 30,
    overflow: 'hidden',
    marginTop: 30,
    marginBottom: 30,
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: 10,
  },
  footerText: {
    color: '#888',
    fontSize: 14,
  },
  footerLink: {
    color: '#1D0D31',
    fontSize: 14,
    fontWeight: 'bold',
  },
});