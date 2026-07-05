import React from 'react';
import { StyleSheet, Text, View, type TextStyle, type ViewStyle } from 'react-native';
import { theme } from '../../theme/theme';

const { colors, typography, spacing, borderRadius } = theme;

interface StepProgressProps {
  current: number;
  total: number;
  title: string;
}

export function StepProgress({ current, total, title }: StepProgressProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.counter}>
        Step {current} of {total}
      </Text>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.track}>
        {Array.from({ length: total }, (_, i) => (
          <View
            key={i}
            style={[styles.segment, i < current && styles.segmentDone]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.s24,
    gap: spacing.s8,
  } as ViewStyle,
  counter: {
    ...(typography.labelSmall as TextStyle),
    color: colors.textTertiary,
    textTransform: 'uppercase',
  },
  title: {
    ...(typography.h1 as TextStyle),
  },
  track: {
    flexDirection: 'row',
    gap: spacing.s6,
    marginTop: spacing.s4,
  } as ViewStyle,
  segment: {
    flex: 1,
    height: 4,
    borderRadius: borderRadius.full,
    backgroundColor: colors.divider,
  } as ViewStyle,
  segmentDone: {
    backgroundColor: colors.primary,
  } as ViewStyle,
});

export default StepProgress;
