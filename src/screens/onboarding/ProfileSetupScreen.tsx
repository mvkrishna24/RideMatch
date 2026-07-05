import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, ShieldCheck } from 'phosphor-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OptionChips } from '../../components/form/OptionChips';
import { PrimaryButton } from '../../components/form/PrimaryButton';
import { StepProgress } from '../../components/form/StepProgress';
import { TextField } from '../../components/form/TextField';
import {
  ACTIVE_DAYS,
  AREAS,
  ARRIVAL_SLOTS,
  BRANCHES,
  COLLEGE,
  GENDERS,
  GENDER_PREFERENCES,
  RETURN_SLOTS,
  VEHICLES,
  YEARS,
  isValidIndianMobile,
} from '../../constants/profileOptions';
import {
  useOnboarding,
  type Gender,
  type GenderPreference,
  type Vehicle,
} from '../../context/OnboardingContext';
import { theme } from '../../theme/theme';

const { colors, typography, spacing, components, iconSizes, layout, copy } = theme;

const STEP_TITLES = ['Who are you?', 'Your daily route', 'Vehicle & safety'];

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { completeProfile } = useOnboarding();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  // Each step starts at the top, not wherever the last step was scrolled to.
  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [step]);

  // Android hardware back steps backwards through the form before exiting.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (step > 1) {
        setStep((s) => s - 1);
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [step]);

  // Step 1 — identity
  const [fullName, setFullName] = useState('');
  const [year, setYear] = useState<string | null>(null);
  const [branch, setBranch] = useState<string | null>(null);
  const [gender, setGender] = useState<Gender | null>(null);

  // Step 2 — commute (area-level only; exact home address is never asked)
  const [fromArea, setFromArea] = useState<string | null>(null);
  const [landmark, setLandmark] = useState('');
  const [arrivalSlot, setArrivalSlot] = useState<string | null>(null);
  const [returnSlot, setReturnSlot] = useState<string | null>(null);
  const [activeDays, setActiveDays] = useState<string[]>(['M', 'T', 'W', 'Th', 'F']);

  // Step 3 — vehicle + safety
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [genderPreference, setGenderPreference] = useState<GenderPreference | null>(null);
  const [emergencyContact, setEmergencyContact] = useState('');

  const handleSelectGender = (value: string) => {
    setGender(value as Gender);
    // Safety default: women start with same-gender matching pre-selected.
    // They can change it; men choose explicitly.
    if (value === 'female' && genderPreference === null) {
      setGenderPreference('same');
    }
  };

  const toggleDay = (value: string) => {
    setActiveDays((prev) =>
      prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value]
    );
  };

  const emergencyValid = isValidIndianMobile(emergencyContact);

  const stepValid =
    step === 1
      ? fullName.trim().length >= 2 && year !== null && branch !== null && gender !== null
      : step === 2
        ? fromArea !== null && arrivalSlot !== null && returnSlot !== null && activeDays.length > 0
        : vehicle !== null && genderPreference !== null && emergencyValid;

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    setSubmitting(true);
    try {
      await completeProfile({
        fullName: fullName.trim(),
        college: COLLEGE,
        year: year!,
        branch: branch!,
        gender: gender!,
        fromArea: fromArea!,
        landmark: landmark.trim(),
        arrivalSlot: arrivalSlot!,
        returnSlot: returnSlot!,
        activeDays,
        vehicle: vehicle!,
        genderPreference: genderPreference!,
        emergencyContact: emergencyContact.trim(),
      });
      // Root guard flips to 'complete' and routes to the Matches tab.
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
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ArrowLeft size={iconSizes.lg} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <StepProgress current={step} total={3} title={STEP_TITLES[step - 1]} />

          {step === 1 && (
            <View>
              <TextField
                label="Full name"
                value={fullName}
                onChangeText={setFullName}
                placeholder="As on your college ID"
                autoCapitalize="words"
              />

              <Text style={styles.fieldLabel}>College</Text>
              <View style={styles.collegeCard}>
                <MapPin size={iconSizes.md} color={colors.primary} weight="fill" />
                <View style={styles.collegeTextBlock}>
                  <Text style={styles.collegeName}>{COLLEGE}</Text>
                  <Text style={styles.collegeCaption}>More colleges soon</Text>
                </View>
              </View>

              <OptionChips label="Year" options={YEARS} selected={year} onToggle={setYear} />
              <OptionChips
                label="Branch"
                options={BRANCHES}
                selected={branch}
                onToggle={setBranch}
              />
              <OptionChips
                label="Gender"
                options={GENDERS}
                selected={gender}
                onToggle={handleSelectGender}
                helper="Used for same-gender matching. Never shown without your preference."
              />
            </View>
          )}

          {step === 2 && (
            <View>
              <OptionChips
                label="Which area do you travel from?"
                options={AREAS}
                selected={fromArea}
                onToggle={setFromArea}
              />
              <TextField
                label="Nearest landmark or stop (optional)"
                value={landmark}
                onChangeText={setLandmark}
                placeholder="e.g. JNTU Metro Station"
                helper="Landmark or stop only — never your exact address."
              />

              <Text style={styles.fieldLabel}>Destination</Text>
              <View style={styles.collegeCard}>
                <MapPin size={iconSizes.md} color={colors.primary} weight="fill" />
                <View style={styles.collegeTextBlock}>
                  <Text style={styles.collegeName}>{COLLEGE}</Text>
                  <Text style={styles.collegeCaption}>All matches are from your college</Text>
                </View>
              </View>

              <OptionChips
                label="When do you reach college?"
                options={ARRIVAL_SLOTS}
                selected={arrivalSlot}
                onToggle={setArrivalSlot}
              />
              <OptionChips
                label="When do you head back?"
                options={RETURN_SLOTS}
                selected={returnSlot}
                onToggle={setReturnSlot}
              />
              <OptionChips
                label="Days you commute"
                options={ACTIVE_DAYS}
                selected={activeDays}
                onToggle={toggleDay}
                multi
              />
            </View>
          )}

          {step === 3 && (
            <View>
              <OptionChips
                label="How do you travel?"
                options={VEHICLES}
                selected={vehicle}
                onToggle={(v) => setVehicle(v as Vehicle)}
              />
              <OptionChips
                label="Who can you be matched with?"
                options={GENDER_PREFERENCES}
                selected={genderPreference}
                onToggle={(v) => setGenderPreference(v as GenderPreference)}
              />
              <TextField
                label="Emergency contact"
                value={emergencyContact}
                onChangeText={setEmergencyContact}
                placeholder="10-digit mobile number"
                keyboardType="phone-pad"
                maxLength={13}
                error={
                  emergencyContact.length > 0 && !emergencyValid
                    ? 'Enter a valid 10-digit Indian mobile number'
                    : undefined
                }
                helper="Required — a parent or guardian we can reach. Never shown on your profile."
              />

              <View style={styles.safetyNote}>
                <ShieldCheck size={iconSizes.md} color={colors.success} weight="fill" />
                <Text style={styles.safetyNoteText}>{copy.safetyBanner}</Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <PrimaryButton
            title={step < 3 ? copy.nextStep : copy.completeProfile}
            onPress={handleNext}
            disabled={!stepValid}
            loading={submitting}
          />
        </View>
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
  topBar: {
    height: layout.topBarHeight,
    justifyContent: 'center',
    paddingHorizontal: spacing.s16,
  } as ViewStyle,
  backBtn: {
    width: layout.touchTargetMin,
    height: layout.touchTargetMin,
    justifyContent: 'center',
  } as ViewStyle,
  scroll: {
    paddingHorizontal: spacing.s24,
    paddingBottom: spacing.s32,
  } as ViewStyle,
  fieldLabel: {
    ...(typography.label as TextStyle),
    color: colors.textPrimary,
    marginBottom: spacing.s6,
  },
  collegeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s12,
    ...(components.card.flat as ViewStyle),
    marginBottom: spacing.s16,
  } as ViewStyle,
  collegeTextBlock: {
    flex: 1,
    gap: spacing.s2,
  } as ViewStyle,
  collegeName: {
    ...(typography.body1SemiBold as TextStyle),
  },
  collegeCaption: {
    ...(typography.labelSmall as TextStyle),
    color: colors.textTertiary,
  },
  safetyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s12,
    backgroundColor: colors.successLight,
    borderRadius: components.card.flat.borderRadius,
    padding: spacing.s16,
    marginTop: spacing.s8,
  } as ViewStyle,
  safetyNoteText: {
    ...(typography.body2 as TextStyle),
    color: colors.textPrimary,
    flex: 1,
  },
  footer: {
    paddingHorizontal: spacing.s24,
    paddingVertical: spacing.s12,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.surface,
  } as ViewStyle,
});
