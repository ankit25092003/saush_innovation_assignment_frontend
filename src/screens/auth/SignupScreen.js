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
import { signup, clearError } from '../../redux/slices/authSlice';
import { useTheme } from '../../hooks/useTheme';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { spacing, fontSize, fontWeight, borderRadius } from '../../theme';

const SignupScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (error) {
      Alert.alert('Signup Failed', error);
      dispatch(clearError());
    }
  }, [error]);

  const handleSignup = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Validation', 'Please fill in all required fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Validation', 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Validation', 'Password must be at least 6 characters');
      return;
    }
    dispatch(
      signup({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      })
    );
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
              colors={[colors.gradientSecondaryStart, colors.gradientSecondaryEnd]}
              style={styles.logoContainer}
            >
              <Text style={styles.logoText}>✨</Text>
            </LinearGradient>
            <Text style={[styles.title, { color: colors.text }]}>
              Create Account
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Join TaskFlow and get organized
            </Text>
          </View>

          {/* Form */}
          <View
            style={[
              styles.formCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Input
              label="Full Name *"
              placeholder="John Doe"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              icon={<Text style={{ fontSize: 18 }}>👤</Text>}
            />

            <Input
              label="Email *"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              icon={<Text style={{ fontSize: 18 }}>📧</Text>}
            />

            <Input
              label="Phone (optional)"
              placeholder="+91 9876543210"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              icon={<Text style={{ fontSize: 18 }}>📱</Text>}
            />

            <Input
              label="Password *"
              placeholder="Min 6 characters"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              icon={<Text style={{ fontSize: 18 }}>🔒</Text>}
            />

            <Input
              label="Confirm Password *"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              icon={<Text style={{ fontSize: 18 }}>🔐</Text>}
            />

            <Button
              title="Create Account"
              onPress={handleSignup}
              loading={loading}
              style={styles.signupButton}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.footerLink, { color: colors.primary }]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing['2xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoText: { fontSize: 32 },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.extrabold,
  },
  subtitle: {
    fontSize: fontSize.base,
    marginTop: spacing.xs,
  },
  formCard: {
    borderRadius: borderRadius['2xl'],
    padding: spacing.xl,
    borderWidth: 1,
  },
  signupButton: {
    marginTop: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  footerText: { fontSize: fontSize.base },
  footerLink: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
});

export default SignupScreen;
