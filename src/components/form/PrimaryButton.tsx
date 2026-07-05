import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { theme } from '../../theme/theme';

const { colors, typography, components } = theme;

type Variant = 'primary' | 'accent' | 'ghost';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
}

export function PrimaryButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
}: PrimaryButtonProps) {
  const blocked = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'accent' && styles.accent,
        variant === 'ghost' && styles.ghost,
        blocked && variant !== 'ghost' && styles.disabled,
      ]}
      onPress={onPress}
      disabled={blocked}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={colors.textInverse} />
      ) : (
        <Text
          style={[
            styles.text,
            variant === 'ghost' && styles.ghostText,
            blocked && variant !== 'ghost' && styles.disabledText,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: components.button.primary.height,
    borderRadius: components.button.primary.borderRadius,
    paddingHorizontal: components.button.primary.paddingHorizontal,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  primary: {
    backgroundColor: components.button.primary.backgroundColor,
  } as ViewStyle,
  accent: {
    backgroundColor: components.button.accent.backgroundColor,
  } as ViewStyle,
  ghost: {
    height: components.button.ghost.height,
    backgroundColor: components.button.ghost.backgroundColor,
  } as ViewStyle,
  disabled: {
    backgroundColor: components.button.primaryDisabled.backgroundColor,
  } as ViewStyle,
  text: {
    ...(typography.buttonText as TextStyle),
    color: colors.textInverse,
  },
  ghostText: {
    ...(typography.buttonTextSm as TextStyle),
    color: colors.primary,
  },
  disabledText: {
    color: colors.textDisabled,
  } as TextStyle,
});

export default PrimaryButton;
