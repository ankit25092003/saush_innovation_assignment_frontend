import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { sendOTP, verifyOTP, clearError, resetOTPState } from '../../redux/slices/authSlice';
import { useTheme } from '../../hooks/useTheme';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { spacing, fontSize, fontWeight, borderRadius } from '../../theme';

const OTPLoginScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const { loading, error, otpSent } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch(clearError());
    }
  }, [error]);

  useEffect(() => {
    return () => {
      dispatch(resetOTPState());
    };
  }, []);

  const handleSendOTP = () => {
    if (!email.trim()) {
      Alert.alert('Validation', 'Please enter your email');
      return;
    }
    dispatch(sendOTP(email.trim()));
  };

  const handleVerifyOTP = () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      Alert.alert('Validation', 'Please enter the complete 6-digit OTP');
      return;
    }
    dispatch(verifyOTP({ email: email.trim(), otp: otpString }));
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
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
              <Text style={styles.logoText}>🔐</Text>
            </LinearGradient>
            <Text style={[styles.title, { color: colors.text }]}>
              OTP Login
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {otpSent
                ? 'Enter the 6-digit code sent to your email'
                : 'Enter your email to receive an OTP'}
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
            {!otpSent ? (
              <>
                <Input
                  label="Email"
                  placeholder="you@example.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  icon={<Text style={{ fontSize: 18 }}>📧</Text>}
                />
                <Button
                  title="Send OTP"
                  onPress={handleSendOTP}
                  loading={loading}
                  style={styles.button}
                />
              </>
            ) : (
              <>
                <Text style={[styles.otpLabel, { color: colors.textSecondary }]}>
                  Enter OTP
                </Text>
                <View style={styles.otpContainer}>
                  {otp.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => (inputRefs.current[index] = ref)}
                      style={[
                        styles.otpInput,
                        {
                          backgroundColor: colors.inputBackground,
                          borderColor: digit
                            ? colors.primary
                            : colors.inputBorder,
                          color: colors.text,
                        },
                      ]}
                      value={digit}
                      onChangeText={(value) =>
                        handleOtpChange(value.slice(-1), index)
                      }
                      onKeyPress={(e) => handleOtpKeyPress(e, index)}
                      keyboardType="number-pad"
                      maxLength={1}
                      textAlign="center"
                    />
                  ))}
                </View>

                <Button
                  title="Verify OTP"
                  onPress={handleVerifyOTP}
                  loading={loading}
                  style={styles.button}
                />

                <TouchableOpacity
                  onPress={handleSendOTP}
                  style={styles.resendLink}
                  disabled={loading}
                >
                  <Text style={[styles.resendText, { color: colors.primary }]}>
                    Resend OTP
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Footer */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backLink}
          >
            <Text style={[styles.backText, { color: colors.primary }]}>
              ← Back to Login
            </Text>
          </TouchableOpacity>
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
  logoText: { fontSize: 36 },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.extrabold,
  },
  subtitle: {
    fontSize: fontSize.base,
    marginTop: spacing.sm,
    textAlign: 'center',
    lineHeight: 22,
  },
  formCard: {
    borderRadius: borderRadius['2xl'],
    padding: spacing.xl,
    borderWidth: 1,
  },
  otpLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    marginBottom: spacing.md,
    marginLeft: spacing.xs,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  button: {
    marginTop: spacing.sm,
  },
  resendLink: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  resendText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  backLink: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  backText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },
});

export default OTPLoginScreen;
