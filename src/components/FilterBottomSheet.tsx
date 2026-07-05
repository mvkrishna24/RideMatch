import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { theme } from '../theme/theme';

export type FilterState = {
  genderPreference: 'any' | 'same';
  hasVehicle: boolean | null;
  departureTimeRange: [number, number];
  selectedDays: ('M' | 'T' | 'W' | 'Th' | 'F' | 'S')[];
  maxDetour: 500 | 1000 | 2000;
};

interface FilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  onReset: () => void;
}

const DEFAULT_FILTERS: FilterState = {
  genderPreference: 'any',
  hasVehicle: null,
  departureTimeRange: [7, 9],
  selectedDays: ['M', 'T', 'W', 'Th', 'F'],
  maxDetour: 1000,
};

const DAYS = ['M', 'T', 'W', 'Th', 'F', 'S'] as const;
type Day = (typeof DAYS)[number];

const DETOUR_OPTIONS: { value: 500 | 1000 | 2000; label: string }[] = [
  { value: 500, label: '500 m' },
  { value: 1000, label: '1 km' },
  { value: 2000, label: '2 km' },
];

const { height: WINDOW_HEIGHT } = Dimensions.get('window');

function formatHour(hour: number): string {
  if (hour === 0) return '12:00 AM';
  if (hour === 12) return '12:00 PM';
  return hour < 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`;
}

export default function FilterBottomSheet({
  visible,
  onClose,
  onApply,
  onReset,
}: FilterBottomSheetProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const translateY = useRef(new Animated.Value(WINDOW_HEIGHT)).current;
  const scrimOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: theme.animation.durationMedium,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scrimOpacity, {
          toValue: 1,
          duration: theme.animation.durationMedium,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: WINDOW_HEIGHT,
          duration: 250,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scrimOpacity, {
          toValue: 0,
          duration: 250,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => setModalVisible(false));
    }
  }, [scrimOpacity, translateY, visible]);

  const handleReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    onReset();
  }, [onReset]);

  const handleApply = useCallback(() => {
    onApply(filters);
  }, [filters, onApply]);

  const toggleDay = useCallback((day: Day) => {
    setFilters(prev => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter(d => d !== day)
        : [...prev.selectedDays, day],
    }));
  }, []);

  const adjustTime = useCallback((index: 0 | 1, delta: number) => {
    setFilters(prev => {
      const [start, end] = prev.departureTimeRange;
      if (index === 0) {
        return {
          ...prev,
          departureTimeRange: [Math.min(Math.max(0, start + delta), end - 1), end],
        };
      }
      return {
        ...prev,
        departureTimeRange: [start, Math.min(Math.max(start + 1, end + delta), 23)],
      };
    });
  }, []);

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <Animated.View style={[styles.scrim, { opacity: scrimOpacity }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Title row */}
          <View style={styles.titleRow}>
            <Text style={styles.title}>Filter matches</Text>
            <TouchableOpacity
              onPress={handleReset}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Ride with */}
            <Text style={styles.sectionLabel}>Ride with</Text>
            <View style={styles.pillRow}>
              {(['any', 'same'] as const).map(val => (
                <TouchableOpacity
                  key={val}
                  style={[styles.pill, filters.genderPreference === val && styles.pillActive]}
                  onPress={() => setFilters(prev => ({ ...prev, genderPreference: val }))}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.pillText,
                      filters.genderPreference === val && styles.pillTextActive,
                    ]}
                  >
                    {val === 'any' ? 'Any' : 'Same gender only'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Has vehicle */}
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Has vehicle</Text>
              <Switch
                value={filters.hasVehicle === true}
                onValueChange={val =>
                  setFilters(prev => ({ ...prev, hasVehicle: val ? true : null }))
                }
                trackColor={{
                  false: theme.palette.neutral200,
                  true: theme.colors.accent,
                }}
                thumbColor={theme.colors.textInverse}
              />
            </View>

            {/* Departure time */}
            <Text style={styles.sectionLabel}>Departure time</Text>
            <View style={styles.timeRow}>
              <View style={styles.timeStepper}>
                <TouchableOpacity style={styles.stepperBtn} onPress={() => adjustTime(0, -1)}>
                  <Text style={styles.stepperBtnText}>–</Text>
                </TouchableOpacity>
                <Text style={styles.timeText}>
                  {formatHour(filters.departureTimeRange[0])}
                </Text>
                <TouchableOpacity style={styles.stepperBtn} onPress={() => adjustTime(0, 1)}>
                  <Text style={styles.stepperBtnText}>+</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.timeRangeSep}>to</Text>
              <View style={styles.timeStepper}>
                <TouchableOpacity style={styles.stepperBtn} onPress={() => adjustTime(1, -1)}>
                  <Text style={styles.stepperBtnText}>–</Text>
                </TouchableOpacity>
                <Text style={styles.timeText}>
                  {formatHour(filters.departureTimeRange[1])}
                </Text>
                <TouchableOpacity style={styles.stepperBtn} onPress={() => adjustTime(1, 1)}>
                  <Text style={styles.stepperBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Days */}
            <Text style={styles.sectionLabel}>Days</Text>
            <View style={styles.daysRow}>
              {DAYS.map(day => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayChip,
                    filters.selectedDays.includes(day) && styles.dayChipActive,
                  ]}
                  onPress={() => toggleDay(day)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.dayChipText,
                      filters.selectedDays.includes(day) && styles.dayChipTextActive,
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Max detour */}
            <Text style={styles.sectionLabel}>Max detour</Text>
            <View style={styles.detourRow}>
              {DETOUR_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.detourChip,
                    filters.maxDetour === opt.value && styles.detourChipActive,
                  ]}
                  onPress={() => setFilters(prev => ({ ...prev, maxDetour: opt.value }))}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.detourChipText,
                      filters.maxDetour === opt.value && styles.detourChipTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

          </ScrollView>

          {/* Apply */}
          <TouchableOpacity style={styles.applyBtn} onPress={handleApply} activeOpacity={0.85}>
            <Text style={styles.applyBtnText}>Apply Filters</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

type FilterBottomSheetStyles = {
  root: ViewStyle;
  scrim: ViewStyle;
  sheet: ViewStyle;
  handle: ViewStyle;
  titleRow: ViewStyle;
  title: TextStyle;
  resetText: TextStyle;
  divider: ViewStyle;
  scrollContent: ViewStyle;
  sectionLabel: TextStyle;
  switchLabel: TextStyle;
  pillRow: ViewStyle;
  pill: ViewStyle;
  pillActive: ViewStyle;
  pillText: TextStyle;
  pillTextActive: TextStyle;
  switchRow: ViewStyle;
  timeRow: ViewStyle;
  timeStepper: ViewStyle;
  stepperBtn: ViewStyle;
  stepperBtnText: TextStyle;
  timeText: TextStyle;
  timeRangeSep: TextStyle;
  daysRow: ViewStyle;
  dayChip: ViewStyle;
  dayChipActive: ViewStyle;
  dayChipText: TextStyle;
  dayChipTextActive: TextStyle;
  detourRow: ViewStyle;
  detourChip: ViewStyle;
  detourChipActive: ViewStyle;
  detourChipText: TextStyle;
  detourChipTextActive: TextStyle;
  applyBtn: ViewStyle;
  applyBtnText: TextStyle;
};

const styles = StyleSheet.create<FilterBottomSheetStyles>({
  root: {
    flex: 1,
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.scrim,
    zIndex: theme.zIndex.overlay,
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surfaceCard,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    paddingTop: theme.spacing.s16,
    paddingHorizontal: theme.spacing.s20,
    paddingBottom: theme.spacing.s32,
    zIndex: theme.zIndex.modal,
    ...(theme.shadows.xl as ViewStyle),
  },
  handle: {
    width: theme.layout.bottomSheetHandleWidth,
    height: theme.layout.bottomSheetHandleHeight,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.palette.neutral300,
    alignSelf: 'center',
    marginBottom: theme.spacing.s20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.s16,
  },
  title: {
    ...(theme.typography.h2 as TextStyle),
  },
  resetText: {
    ...(theme.typography.body2Medium as TextStyle),
    color: theme.colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginBottom: theme.spacing.s24,
  },
  scrollContent: {
    paddingBottom: theme.spacing.s8,
  },
  sectionLabel: {
    ...(theme.typography.label as TextStyle),
    marginBottom: theme.spacing.s12,
  },
  switchLabel: {
    ...(theme.typography.label as TextStyle),
  },
  pillRow: {
    flexDirection: 'row',
    gap: theme.spacing.s8,
    marginBottom: theme.spacing.s24,
  },
  pill: {
    paddingHorizontal: theme.spacing.s16,
    paddingVertical: theme.spacing.s8,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.palette.neutral100,
  },
  pillActive: {
    backgroundColor: theme.colors.accent,
  },
  pillText: {
    ...(theme.typography.body2Medium as TextStyle),
    color: theme.colors.textSecondary,
  },
  pillTextActive: {
    color: theme.colors.textInverse,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.s24,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.s12,
    marginBottom: theme.spacing.s24,
  },
  timeStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.s12,
  },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.palette.neutral100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnText: {
    ...(theme.typography.body1SemiBold as TextStyle),
    color: theme.colors.textPrimary,
  },
  timeText: {
    ...(theme.typography.body2Medium as TextStyle),
    color: theme.colors.textPrimary,
    minWidth: 72,
    textAlign: 'center',
  },
  timeRangeSep: {
    ...(theme.typography.body2 as TextStyle),
    color: theme.colors.textSecondary,
  },
  daysRow: {
    flexDirection: 'row',
    gap: theme.spacing.s8,
    marginBottom: theme.spacing.s24,
  },
  dayChip: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.palette.neutral100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayChipActive: {
    backgroundColor: theme.colors.accent,
  },
  dayChipText: {
    ...(theme.typography.chipText as TextStyle),
    color: theme.colors.textTertiary,
  },
  dayChipTextActive: {
    color: theme.colors.textInverse,
  },
  detourRow: {
    flexDirection: 'row',
    gap: theme.spacing.s8,
    marginBottom: theme.spacing.s24,
  },
  detourChip: {
    paddingHorizontal: theme.spacing.s16,
    paddingVertical: theme.spacing.s8,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.palette.neutral100,
  },
  detourChipActive: {
    backgroundColor: theme.colors.accentLight,
    borderColor: theme.colors.accent,
    borderWidth: 1.5,
  },
  detourChipText: {
    ...(theme.typography.body2Medium as TextStyle),
    color: theme.colors.textSecondary,
  },
  detourChipTextActive: {
    color: theme.colors.accent,
  },
  applyBtn: {
    backgroundColor: theme.colors.primary,
    height: theme.layout.touchTargetMd,
    borderRadius: theme.borderRadius['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.s16,
    ...(theme.shadows.primaryGlow as ViewStyle),
  },
  applyBtnText: {
    ...(theme.typography.buttonText as TextStyle),
  },
});
