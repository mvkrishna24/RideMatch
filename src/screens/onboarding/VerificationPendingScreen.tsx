import { useRouter } from 'expo-router';
import { SealCheck } from 'phosphor-react-native';
import React from 'react';
import { StyleSheet, Text, View, type TextStyle, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../../components/form/PrimaryButton';
import { useOnboarding } from '../../context/OnboardingContext';
import { theme } from '../../theme/theme';

const { colors, typography, spacing, borderRadius } = theme;

export default function VerificationPendingScreen() {
  const router = useRouter();
  const { email, signOut } = useOnboarding();

  const handleSwitchAccount = async () => {
    await signOut();
    router.replace('/welcome');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <SealCheck size={48} color={colors.primary} weight="fill" />
          </View>

          <Text style={styles.title}>Verified students only</Text>
          <Text style={styles.body}>
            We verify students before showing them in matches — that&apos;s
            what keeps RouteMatch safe for everyone.
          </Text>
          <Text style={styles.body}>
            Your account ({email}) is in review. Verification usually takes
            less than 24 hours.
          </Text>
        </View>

        <View style={styles.footer}>
          <PrimaryButton
            title="Set up my profile while I wait"
            onPress={() => router.push('/profile-setup')}
          />
          <PrimaryButton
            title="Use a different account"
            variant="ghost"
            onPress={handleSwitchAccount}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface,
  } as ViewStyle,
  container: {
    flex: 1,
    paddingHorizontal: spacing.s24,
    justifyContent: 'space-between',
  } as ViewStyle,
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.s16,
  } as ViewStyle,
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.s8,
  } as ViewStyle,
  title: {
    ...(typography.h1 as TextStyle),
    textAlign: 'center',
  },
  body: {
    ...(typography.body1 as TextStyle),
    color: colors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    gap: spacing.s8,
    paddingBottom: spacing.s24,
  } as ViewStyle,
});
