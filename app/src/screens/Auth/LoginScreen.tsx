import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Text as RNText } from 'react-native';
import { TextInput, HelperText, Snackbar } from 'react-native-paper';
import { supabase } from '../../services/supabase';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    if (!email.match(/^\S+@\S+\.\S+$/)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else if (data?.user) {
      setSuccess('Logged in successfully');
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
        <RNText style={styles.headerText}>Hello{'\n'}Sign in!</RNText>
      </View>
      <KeyboardAvoidingView
        style={styles.cardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          <TextInput
            label="Gmail"
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
          {error ? <HelperText type="error" visible={!!error}>{error}</HelperText> : null}
          
          <TouchableOpacity style={styles.forgotPasswordContainer}>
            <RNText style={styles.forgotPasswordText}>Forgot password?</RNText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={!email || !password || loading}
            style={styles.buttonWrapper}
          >
            <LinearGradient
              colors={['#A01031', '#1D0D31']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.buttonGradient, (!email || !password || loading) && { opacity: 0.7 }]}
            >
              <RNText style={styles.buttonText}>{loading ? 'LOGGING IN...' : 'SIGN IN'}</RNText>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.footerContainer}>
            <RNText style={styles.footerText}>Don't have account? </RNText>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <RNText style={styles.footerLink}>Sign up</RNText>
            </TouchableOpacity>
          </View>
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
    paddingTop: 50,
    paddingBottom: 40,
    flex: 1,
    marginTop: 20,
  },
  input: {
    marginBottom: 20,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    height: 50,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: '#666',
    fontWeight: '500',
  },
  buttonWrapper: {
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 40,
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