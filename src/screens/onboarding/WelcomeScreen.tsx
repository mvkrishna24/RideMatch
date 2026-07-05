import { useRouter } from 'expo-router';
import { SealCheck, UsersThree } from 'phosphor-react-native';
import React from 'react';
import { StyleSheet, Text, View, type TextStyle, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../../components/form/PrimaryButton';
import { theme } from '../../theme/theme';

const { colors, typography, spacing, components, iconSizes, copy } = theme;

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.wordmark}>
            <Text style={styles.wordmarkRoute}>Route</Text>
            <Text style={styles.wordmarkMate}>Mate</Text>
          </Text>

          <View style={styles.tagline}>
            <Text style={styles.taglineLine}>Same route.</Text>
            <Text style={styles.taglineLine}>Every day.</Text>
            <Text style={styles.taglineLineAccent}>Together.</Text>
          </View>

          <Text style={styles.subtitle}>
            Find verified college commute partners from your route.
          </Text>

          <View style={styles.trustRow}>
            <View style={styles.trustChip}>
              <SealCheck size={iconSizes.sm} color={colors.primary} weight="fill" />
              <Text style={styles.trustChipText}>Verified students only</Text>
            </View>
            <View style={styles.trustChip}>
              <UsersThree size={iconSizes.sm} color={colors.primary} />
              <Text style={styles.trustChipText}>Your college, your routes</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <PrimaryButton
            title={copy.getStarted}
            variant="accent"
            onPress={() => router.push('/sign-up')}
          />
          <PrimaryButton
            title="I already have an account"
            variant="ghost"
            onPress={() => router.push('/sign-in')}
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
  hero: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.s24,
  } as ViewStyle,
  wordmark: {
    ...(typography.display1 as TextStyle),
  },
  wordmarkRoute: {
    color: colors.primary,
  } as TextStyle,
  wordmarkMate: {
    color: colors.accent,
  } as TextStyle,
  tagline: {
    gap: spacing.s2,
  } as ViewStyle,
  taglineLine: {
    ...(typography.h1 as TextStyle),
    color: colors.textPrimary,
  },
  taglineLineAccent: {
    ...(typography.h1 as TextStyle),
    color: colors.accent,
  },
  subtitle: {
    ...(typography.body1 as TextStyle),
    color: colors.textSecondary,
  },
  trustRow: {
    gap: spacing.s8,
  } as ViewStyle,
  trustChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s8,
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    borderRadius: components.chip.default.borderRadius,
    paddingHorizontal: spacing.s12,
    paddingVertical: spacing.s6,
  } as ViewStyle,
  trustChipText: {
    ...(typography.chipText as TextStyle),
    color: colors.primary,
  },
  footer: {
    gap: spacing.s8,
    paddingBottom: spacing.s24,
  } as ViewStyle,
});
