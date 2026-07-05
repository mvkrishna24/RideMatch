import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { theme } from '../../theme/theme';

const { colors, typography, spacing, components } = theme;

interface TextFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  helper?: string;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words';
  maxLength?: number;
}

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  helper,
  error,
  keyboardType,
  secureTextEntry,
  autoCapitalize = 'sentences',
  maxLength,
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          focused && styles.inputFocused,
          !!error && styles.inputError,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        maxLength={maxLength}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {!!error && <Text style={styles.errorText}>{error}</Text>}
      {!error && !!helper && <Text style={styles.helperText}>{helper}</Text>}
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
    marginBottom: spacing.s6,
  },
  input: {
    ...(components.input.default as ViewStyle),
    ...(typography.body1 as TextStyle),
    color: colors.textPrimary,
  } as TextStyle,
  inputFocused: {
    borderColor: components.input.focused.borderColor,
    backgroundColor: components.input.focused.backgroundColor,
  } as TextStyle,
  inputError: {
    borderColor: components.input.error.borderColor,
    backgroundColor: components.input.error.backgroundColor,
  } as TextStyle,
  errorText: {
    ...(typography.labelSmall as TextStyle),
    color: colors.error,
    marginTop: spacing.s4,
  },
  helperText: {
    ...(typography.labelSmall as TextStyle),
    color: colors.textTertiary,
    marginTop: spacing.s4,
  },
});

export default TextField;
