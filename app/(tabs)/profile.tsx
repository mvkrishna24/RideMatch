import { MapPin, SealCheck } from 'phosphor-react-native';
import { StyleSheet, Text, View, type TextStyle, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '../../src/components/form/PrimaryButton';
import { ARRIVAL_SLOTS, COLLEGE } from '../../src/constants/profileOptions';
import { useOnboarding } from '../../src/context/OnboardingContext';
import { theme } from '../../src/theme/theme';

const { colors, typography, spacing, components } = theme;

export default function ProfileScreen() {
  const { profile, email, signOut } = useOnboarding();

  if (!profile) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.body}>Complete setup to see your profile.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const arrivalLabel =
    ARRIVAL_SLOTS.find((s) => s.value === profile.arrivalSlot)?.label ?? profile.arrivalSlot;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{profile.fullName}</Text>
            <SealCheck size={20} color={colors.primary} weight="fill" />
          </View>
          <Text style={styles.meta}>
            {profile.year} Year • {profile.branch} • {COLLEGE}
          </Text>

          <View style={styles.routeRow}>
            <MapPin size={16} color={colors.textSecondary} />
            <Text style={styles.routeText}>
              {profile.fromArea} → {profile.college}
            </Text>
          </View>
          <Text style={styles.meta}>
            Reaches {arrivalLabel} • {profile.activeDays.length} days a week
          </Text>

          <Text style={styles.email}>Signed in as {email}</Text>
        </View>

        <PrimaryButton title="Sign out" variant="ghost" onPress={signOut} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface,
  } as ViewStyle,
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  container: {
    flex: 1,
    padding: spacing.s20,
    gap: spacing.s16,
  } as ViewStyle,
  card: {
    ...(components.card.elevated as ViewStyle),
    gap: spacing.s8,
  } as ViewStyle,
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s8,
  } as ViewStyle,
  name: {
    ...(typography.h2 as TextStyle),
  },
  meta: {
    ...(typography.body2 as TextStyle),
    color: colors.textSecondary,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s6,
    marginTop: spacing.s8,
  } as ViewStyle,
  routeText: {
    ...(typography.body1Medium as TextStyle),
  },
  email: {
    ...(typography.labelSmall as TextStyle),
    color: colors.textTertiary,
    marginTop: spacing.s12,
  },
  body: {
    ...(typography.body2 as TextStyle),
    color: colors.textSecondary,
  },
});
