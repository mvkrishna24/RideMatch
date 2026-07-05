import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../../components/form/PrimaryButton';
import { TextField } from '../../components/form/TextField';
import { useOnboarding } from '../../context/OnboardingContext';
import { friendlyAuthError } from '../../lib/firebase';
import { theme } from '../../theme/theme';

const { colors, typography, spacing } = theme;

const EMAIL_RE = /^\S+@\S+\.\S+$/;

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useOnboarding();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const emailValid = EMAIL_RE.test(email.trim());
  const passwordValid = password.length >= 6;
  const canContinue = emailValid && passwordValid && !submitting;

  const handleContinue = async () => {
    setSubmitting(true);
    setFormError(null);
    try {
      await signUp(email.trim().toLowerCase(), password);
      router.replace('/verification-pending');
    } catch (err) {
      setFormError(friendlyAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>
            Use the email you check daily — we&apos;ll send your verification
            result there.
          </Text>

          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={email.length > 0 && !emailValid ? 'Enter a valid email address' : undefined}
          />
          <TextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="At least 6 characters"
            secureTextEntry
            autoCapitalize="none"
            error={
              password.length > 0 && !passwordValid
                ? 'Password must be at least 6 characters'
                : undefined
            }
          />

          {!!formError && <Text style={styles.formError}>{formError}</Text>}

          <PrimaryButton
            title="Continue"
            onPress={handleContinue}
            disabled={!canContinue}
            loading={submitting}
          />
          <PrimaryButton
            title="I already have an account"
            variant="ghost"
            onPress={() => router.replace('/sign-in')}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface,
  } as ViewStyle,
  flex: {
    flex: 1,
  } as ViewStyle,
  scroll: {
    padding: spacing.s24,
    gap: spacing.s4,
  } as ViewStyle,
  title: {
    ...(typography.h1 as TextStyle),
    marginBottom: spacing.s8,
  },
  subtitle: {
    ...(typography.body2 as TextStyle),
    color: colors.textSecondary,
    marginBottom: spacing.s24,
  },
  formError: {
    ...(typography.body2 as TextStyle),
    color: colors.error,
    marginBottom: spacing.s12,
  },
});
