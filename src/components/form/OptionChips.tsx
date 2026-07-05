import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import type { ChipOption } from '../../constants/profileOptions';
import { theme } from '../../theme/theme';

const { colors, typography, spacing, components, layout } = theme;

interface OptionChipsProps {
  label: string;
  options: ChipOption[];
  /** Single-select: string. Multi-select: string[]. */
  selected: string | string[] | null;
  onToggle: (value: string) => void;
  helper?: string;
  multi?: boolean;
}

export function OptionChips({
  label,
  options,
  selected,
  onToggle,
  helper,
  multi = false,
}: OptionChipsProps) {
  const isSelected = (value: string) =>
    multi ? Array.isArray(selected) && selected.includes(value) : selected === value;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {options.map((opt) => {
          const active = isSelected(opt.value);
          return (
            <TouchableOpacity
              key={opt.value}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onToggle(opt.value)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {!!helper && <Text style={styles.helperText}>{helper}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.s16,
  } as ViewStyle,
  label: {
    ...(typography.label as TextStyle),
    color: colors.textPrimary,
    marginBottom: spacing.s8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s8,
  } as ViewStyle,
  chip: {
    ...(components.chip.default as ViewStyle),
    paddingVertical: spacing.s10,
    paddingHorizontal: spacing.s16,
    minHeight: layout.touchTargetMin,
    justifyContent: 'center',
  } as ViewStyle,
  chipActive: {
    backgroundColor: colors.accentLight,
    borderColor: colors.accent,
    borderWidth: 1.5,
  } as ViewStyle,
  chipText: {
    ...(typography.chipText as TextStyle),
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.accent,
  } as TextStyle,
  helperText: {
    ...(typography.labelSmall as TextStyle),
    color: colors.textTertiary,
    marginTop: spacing.s6,
  },
});

export default OptionChips;
