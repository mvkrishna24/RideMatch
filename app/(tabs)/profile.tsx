import { StyleSheet, Text, View, type TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../../src/theme/theme';

const { colors, typography, spacing } = theme;

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Your profile</Text>
        <Text style={styles.body}>
          Profile and route setup arrive with account creation in the next release.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.s24,
    gap: spacing.s8,
  },
  title: {
    ...(typography.h3 as TextStyle),
    textAlign: 'center',
  },
  body: {
    ...(typography.body2 as TextStyle),
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
