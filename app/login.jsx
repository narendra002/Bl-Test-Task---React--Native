import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, LogIn } from 'lucide-react-native';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useTheme } from '@/theme';
import { loginUser } from '@/features/auth/authService';
import { setUser } from '@/features/auth/authSlice';
import { getValidationErrors } from '@/utils/validation';

export default function LoginScreen() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('Password123');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleLogin = useCallback(async () => {
    const validationErrors = getValidationErrors({ email, password });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      const result = await loginUser(email, password);
      if (result.success) {
        dispatch(setUser(result.user));
        router.replace('/(tabs)/home');
      } else {
        Alert.alert('Login Failed', result.error);
      }
    } catch (e) {
      console.log('Login error:', e);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [email, password, dispatch, router]);

  return (
    <View style={[styles.outerContainer, { backgroundColor: theme.colors.primary }]}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.flex}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.headerSection}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <LogIn size={32} color={theme.colors.white} />
              </View>
              <Text style={styles.headerTitle}>Welcome Back</Text>
              <Text style={styles.headerSubtitle}>Sign in to your account</Text>
            </View>

            <View style={[styles.formCard, { backgroundColor: theme.colors.surface }]}>
              <Input
                testID="login-email"
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                error={errors.email}
              />
              <Input
                testID="login-password"
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                error={errors.password}
              />

              <Button
                testID="login-submit"
                title="Sign In"
                onPress={handleLogin}
                loading={loading}
                style={{ marginTop: 8 }}
              />

              <View style={styles.footer}>
                <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
                  Don't have an account?
                </Text>
                <TouchableOpacity onPress={() => router.push('/signup')}>
                  <Text style={[styles.linkText, { color: theme.colors.primary }]}> Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
  },
  formCard: {
    borderRadius: 24,
    padding: 24,
    paddingTop: 28,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
