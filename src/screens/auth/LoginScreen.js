import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../redux/slices/authSlice';
import { useTheme } from '../../hooks/useTheme';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { spacing, fontSize, fontWeight, borderRadius } from '../../theme';

const LoginScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (error) {
      Alert.alert('Login Failed', error);
      dispatch(clearError());
    }
  }, [error]);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Validation', 'Please fill in all fields');
      return;
    }
    dispatch(login({ email: email.trim(), password }));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <LinearGradient
              colors={[colors.gradientStart, colors.gradientEnd]}
              style={styles.logoContainer}
            >
              <Text style={styles.logoText}>📋</Text>
            </LinearGradient>
            <Text style={[styles.appName, { color: colors.text }]}>
              TaskFlow
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Manage your projects with ease
            </Text>
          </View>

          {/* Form */}
          <View
            style={[
              styles.formCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                shadowColor: colors.shadow,
              },
            ]}
          >
            <Text style={[styles.formTitle, { color: colors.text }]}>
              Welcome Back
            </Text>
            <Text style={[styles.formSubtitle, { color: colors.textSecondary }]}>
              Sign in to continue
            </Text>

            <Input
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              icon={<Text style={{ fontSize: 18 }}>📧</Text>}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              icon={<Text style={{ fontSize: 18 }}>🔒</Text>}
            />

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate('OTPLogin')}
              style={styles.otpLink}
            >
              <Text style={[styles.otpText, { color: colors.primary }]}>
                🔑 Login with OTP instead
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={[styles.footerLink, { color: colors.primary }]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing['3xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: borderRadius['2xl'],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  logoText: {
    fontSize: 36,
  },
  appName: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.extrabold,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: fontSize.base,
    marginTop: spacing.xs,
  },
  formCard: {
    borderRadius: borderRadius['2xl'],
    padding: spacing.xl,
    borderWidth: 1,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  formTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs,
  },
  formSubtitle: {
    fontSize: fontSize.base,
    marginBottom: spacing.xl,
  },
  loginButton: {
    marginTop: spacing.sm,
  },
  otpLink: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  otpText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    fontSize: fontSize.base,
  },
  footerLink: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
});

export default LoginScreen;
