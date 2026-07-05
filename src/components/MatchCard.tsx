import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  type ImageStyle,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import {
  MapPin,
  Motorcycle,
  ArrowRight,
  SealCheck,
} from 'phosphor-react-native';
import { theme } from '../theme/theme';

const { colors, typography, spacing, borderRadius, shadows, components, iconSizes } = theme;
const { palette } = theme;

// ── Types ──────────────────────────────────────────────────────────────────

export interface RouteMatch {
  id: string;
  name: string;
  year: string;
  department: string;
  /** Absent until real profile photos ship — initials avatar renders instead. */
  photo?: string;
  isVerified: boolean;
  fromLocation: string;
  toLocation: string;
  departureTime: string;
  activeDays: string[];
  matchPercentage: number;
  vehicle: 'bike' | 'scooty' | 'car' | null;
  gender: 'male' | 'female' | 'neutral';
  connectionState: 'default' | 'incoming' | 'interest_received' | 'pending';
}

interface MatchCardProps {
  match: RouteMatch;
  onPress: () => void;
  onSendInterest: () => void;
  onAccept: () => void;
  onDecline: () => void;
  onOpenChat: () => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function getGenderColor(gender: RouteMatch['gender']): string {
  if (gender === 'male') return colors.genderMale;
  if (gender === 'female') return colors.genderFemale;
  return colors.genderNeutral;
}

// ── Component ──────────────────────────────────────────────────────────────

export function MatchCard({
  match,
  onPress,
  onSendInterest,
  onAccept,
  onOpenChat,
}: MatchCardProps) {
  const {
    name, year, department, photo, isVerified,
    fromLocation, toLocation,
    departureTime, activeDays, matchPercentage, vehicle, gender,
    connectionState,
  } = match;

  // Day keys match profile setup and filters: 'T' = Tuesday, 'Th' = Thursday.
  const allDays = ['M', 'T', 'W', 'Th', 'F', 'S'];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.95}>

      {/* Incoming interest banner */}
      {(connectionState === 'incoming' || connectionState === 'interest_received') && (
        <View style={styles.incomingBanner}>
          <Text style={styles.incomingBannerText}>
            They want to ride with you →
          </Text>
        </View>
      )}

      {/* Top row: avatar + identity */}
      <View style={styles.topRow}>
        <View style={styles.avatarWrapper}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Text style={styles.avatarInitials}>
                {name
                  .split(' ')
                  .slice(0, 2)
                  .map((part) => part.charAt(0).toUpperCase())
                  .join('')}
              </Text>
            </View>
          )}

          {isVerified && (
            <View style={styles.verifiedBadge}>
              <SealCheck
                size={iconSizes.xs}
                color={colors.textInverse}
                weight="fill"
              />
            </View>
          )}
        </View>

        <View style={styles.identityBlock}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>{name}</Text>
            <View style={[styles.genderDot, { backgroundColor: getGenderColor(gender) }]} />
          </View>
          <Text style={styles.meta}>{year} • {department}</Text>
        </View>
      </View>

      {/* Route visualization */}
      <View style={styles.routeRow}>
        <View style={styles.routeChip}>
          <MapPin size={iconSizes.sm} color={colors.textSecondary} />
          <Text style={styles.routeChipText} numberOfLines={1}>{fromLocation}</Text>
        </View>

        <ArrowRight size={iconSizes.sm} color={colors.accent} />

        <View style={styles.routeChip}>
          <MapPin size={iconSizes.sm} color={colors.primary} weight="fill" />
          <Text style={[styles.routeChipText, styles.routeChipTextDest]} numberOfLines={1}>
            {toLocation}
          </Text>
        </View>
      </View>

      {/* Time + days */}
      <View style={styles.timeRow}>
        <Text style={styles.timeChip}>{departureTime} daily</Text>
        <View style={styles.daysRow}>
          {allDays.map((day, i) => {
            const isActive = activeDays.includes(day);
            return (
              <View
                key={`${day}-${i}`}
                style={[styles.dayPill, isActive && styles.dayPillActive]}
              >
                <Text style={[styles.dayPillText, isActive && styles.dayPillTextActive]}>
                  {day}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Compatibility row */}
      <View style={styles.compatRow}>
        <View style={styles.compatChip}>
          <Text style={[styles.matchPercent, { color: colors.reliabilityHigh }]}>
            {matchPercentage}% match
          </Text>
        </View>

        <View style={styles.compatChip}>
          {isVerified ? (
            <>
              <SealCheck size={iconSizes.sm} color={colors.primary} weight="fill" />
              <Text style={styles.verifiedText}>Verified student</Text>
            </>
          ) : (
            <Text style={styles.newMemberText}>New member</Text>
          )}
        </View>

        {vehicle === 'bike' && (
          <View style={styles.compatChip}>
            <Motorcycle size={iconSizes.sm} color={colors.textSecondary} />
          </View>
        )}
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Action row */}
      {connectionState === 'default' && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionBtnOutline}
            onPress={onOpenChat}
            activeOpacity={0.7}
          >
            <Text style={styles.actionBtnOutlineText}>View Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtnAccent}
            onPress={onSendInterest}
            activeOpacity={0.8}
          >
            <Text style={styles.actionBtnAccentText}>Send Interest</Text>
          </TouchableOpacity>
        </View>
      )}

      {connectionState === 'pending' && (
        <View style={styles.actionRow}>
          <View style={[styles.actionBtnOutline, styles.actionBtnDisabled]}>
            <Text style={styles.actionBtnDisabledText}>Interest Sent ✓</Text>
          </View>
        </View>
      )}

      {(connectionState === 'incoming' || connectionState === 'interest_received') && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionBtnAccept}
            onPress={onAccept}
            activeOpacity={0.8}
          >
            <Text style={styles.actionBtnAccentText}>Accept Ride Request</Text>
          </TouchableOpacity>
        </View>
      )}

    </TouchableOpacity>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────

type MatchCardStyles = {
  card: ViewStyle;
  incomingBanner: ViewStyle;
  incomingBannerText: TextStyle;
  topRow: ViewStyle;
  avatarWrapper: ViewStyle;
  avatar: ImageStyle;
  avatarFallback: ViewStyle;
  avatarInitials: TextStyle;
  verifiedBadge: ViewStyle;
  identityBlock: ViewStyle;
  nameRow: ViewStyle;
  name: TextStyle;
  genderDot: ViewStyle;
  meta: TextStyle;
  routeRow: ViewStyle;
  routeChip: ViewStyle;
  routeChipText: TextStyle;
  routeChipTextDest: TextStyle;
  timeRow: ViewStyle;
  timeChip: TextStyle;
  daysRow: ViewStyle;
  dayPill: ViewStyle;
  dayPillActive: ViewStyle;
  dayPillText: TextStyle;
  dayPillTextActive: TextStyle;
  compatRow: ViewStyle;
  compatChip: ViewStyle;
  matchPercent: TextStyle;
  verifiedText: TextStyle;
  newMemberText: TextStyle;
  divider: ViewStyle;
  actionRow: ViewStyle;
  actionBtnOutline: ViewStyle;
  actionBtnOutlineText: TextStyle;
  actionBtnAccent: ViewStyle;
  actionBtnAccept: ViewStyle;
  actionBtnAccentText: TextStyle;
  actionBtnDisabled: ViewStyle;
  actionBtnDisabledText: TextStyle;
};

const styles = StyleSheet.create<MatchCardStyles>({
  card: {
    ...(components.card.match as ViewStyle),
  },

  incomingBanner: {
    backgroundColor: colors.accentLight,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.s6,
    paddingHorizontal: spacing.s12,
    marginBottom: spacing.s12,
    alignItems: 'center',
  },
  incomingBannerText: {
    ...(typography.body2Medium as TextStyle),
    color: colors.accent,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s12,
    marginBottom: spacing.s12,
  },
  avatarWrapper: {
    position: 'relative',
    width: components.avatar.md.width,
    height: components.avatar.md.height,
  },
  avatar: {
    width: components.avatar.md.width,
    height: components.avatar.md.height,
    borderRadius: components.avatar.md.borderRadius,
    backgroundColor: colors.skeletonBase,
  },
  avatarFallback: {
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    ...(typography.body1SemiBold as TextStyle),
    color: colors.primary,
  },
  verifiedBadge: {
    ...(components.verifiedBadge as ViewStyle),
  },
  identityBlock: {
    flex: 1,
    gap: spacing.s4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s8,
  },
  name: {
    ...(typography.h3 as TextStyle),
    flex: 1,
  },
  genderDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  meta: {
    ...(typography.caption as TextStyle),
    color: colors.textSecondary,
  },

  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s8,
    marginBottom: spacing.s12,
  },
  routeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s4,
    flex: 1,
    backgroundColor: palette.neutral100,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.s6,
    paddingHorizontal: spacing.s8,
  },
  routeChipText: {
    ...(typography.chipText as TextStyle),
    color: colors.textSecondary,
    flex: 1,
  },
  routeChipTextDest: {
    color: colors.primary,
  },

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.s12,
  },
  timeChip: {
    ...(typography.body2Medium as TextStyle),
    color: colors.textSecondary,
  },
  daysRow: {
    flexDirection: 'row',
    gap: spacing.s4,
  },
  dayPill: {
    width: 22,
    height: 22,
    borderRadius: borderRadius.full,
    backgroundColor: palette.neutral100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayPillActive: {
    backgroundColor: colors.accent,
  },
  dayPillText: {
    ...(typography.micro as TextStyle),
    color: colors.textTertiary,
  },
  dayPillTextActive: {
    color: colors.textInverse,
  },

  compatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s12,
    marginBottom: spacing.s12,
  },
  compatChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s4,
  },
  matchPercent: {
    ...(typography.body2SemiBold as TextStyle),
  },
  verifiedText: {
    ...(typography.body2SemiBold as TextStyle),
    color: colors.primary,
  },
  newMemberText: {
    ...(typography.body2Medium as TextStyle),
    color: colors.textSecondary,
  },

  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginBottom: spacing.s12,
  },

  actionRow: {
    flexDirection: 'row',
    gap: spacing.s8,
  },
  actionBtnOutline: {
    flex: 1,
    height: components.button.sm.height,
    borderRadius: components.button.sm.borderRadius,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnOutlineText: {
    ...(typography.buttonTextSm as TextStyle),
    color: colors.primary,
  },
  actionBtnAccent: {
    flex: 1,
    height: components.button.sm.height,
    borderRadius: components.button.sm.borderRadius,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.accentGlow,
  },
  actionBtnAccept: {
    flex: 1,
    height: components.button.sm.height,
    borderRadius: components.button.sm.borderRadius,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnAccentText: {
    ...(typography.buttonTextSm as TextStyle),
    color: colors.textInverse,
  },
  actionBtnDisabled: {
    borderColor: colors.border,
    backgroundColor: palette.neutral50,
  },
  actionBtnDisabledText: {
    ...(typography.buttonTextSm as TextStyle),
    color: colors.textDisabled,
  },
});

export default MatchCard;
