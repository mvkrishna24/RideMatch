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
import { theme } from '../../theme/theme';

const { colors, typography, spacing } = theme;

const EMAIL_RE = /^\S+@\S+\.\S+$/;

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, profile } = useOnboarding();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const emailValid = EMAIL_RE.test(email.trim());
  const canContinue = emailValid && password.length >= 6 && !submitting;

  const handleContinue = async () => {
    setSubmitting(true);
    try {
      await signIn(email.trim().toLowerCase());
      // With a completed profile the root guard flips straight to the tabs;
      // otherwise the user still needs the profile setup path.
      if (!profile) {
        router.replace('/verification-pending');
      }
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
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to see who&apos;s on your route.</Text>

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
            placeholder="Your password"
            secureTextEntry
            autoCapitalize="none"
          />

          <PrimaryButton
            title="Continue"
            onPress={handleContinue}
            disabled={!canContinue}
            loading={submitting}
          />
          <PrimaryButton
            title="New here? Create an account"
            variant="ghost"
            onPress={() => router.replace('/sign-up')}
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
});
