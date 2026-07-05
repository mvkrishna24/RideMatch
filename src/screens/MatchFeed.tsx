import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Animated,
  RefreshControl,
  StyleSheet,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { Bell, MagnifyingGlass, SlidersHorizontal } from 'phosphor-react-native';
import { theme } from '../theme/theme';
import { MatchCard, type RouteMatch } from '../components/MatchCard';
import { ARRIVAL_SLOTS, COLLEGE_SHORT } from '../constants/profileOptions';
import { useOnboarding } from '../context/OnboardingContext';
import type { MatchResponse } from '../lib/apiTypes';
import { useAcceptInterest, useMatches, useSendInterest } from '../lib/queries';

const { colors, typography, spacing, borderRadius, shadows, components, iconSizes, copy } = theme;
const { palette } = theme;

// ── API → card model ───────────────────────────────────────────────────────

function toCardModel(m: MatchResponse): RouteMatch {
  const slotLabel =
    ARRIVAL_SLOTS.find((s) => s.value === m.morningTime)?.label ?? m.morningTime;
  return {
    id: m.userId,
    name: m.name ?? 'Verified student',
    year: m.year ? `${m.year} Year` : '',
    department: m.branch ?? '',
    isVerified: true, // the backend only ever returns VERIFIED students
    fromLocation: m.fromArea,
    toLocation: COLLEGE_SHORT,
    departureTime: slotLabel,
    activeDays: m.activeDays ? m.activeDays.split(',') : [],
    matchPercentage: m.matchScore,
    vehicle:
      m.vehicleType === 'NONE'
        ? null
        : (m.vehicleType.toLowerCase() as RouteMatch['vehicle']),
    gender: (m.gender?.toLowerCase() ?? 'neutral') as RouteMatch['gender'],
    connectionState: m.incomingInterestId
      ? 'interest_received'
      : m.outgoingInterestStatus === 'PENDING'
        ? 'pending'
        : 'default',
  };
}

// ── Skeleton Card ──────────────────────────────────────────────────────────

function SkeletonCard() {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, [shimmer]);

  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0.85] });

  return (
    <Animated.View style={[styles.skeletonCard, { opacity }]}>
      <View style={styles.skeletonTopRow}>
        <View style={styles.skeletonAvatar} />
        <View style={styles.skeletonMeta}>
          <View style={[styles.skeletonLine, { width: 130 }]} />
          <View style={[styles.skeletonLine, { width: 90, marginTop: spacing.s6 }]} />
        </View>
      </View>
      <View style={[styles.skeletonLine, { width: '100%', height: 36, marginBottom: spacing.s10 }]} />
      <View style={[styles.skeletonLine, { width: '55%', marginBottom: spacing.s10 }]} />
      <View style={[styles.skeletonLine, { width: '100%', height: 40 }]} />
    </Animated.View>
  );
}

// ── Empty State ────────────────────────────────────────────────────────────

function EmptyState({ onReviewRoute }: { onReviewRoute: () => void }) {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>{copy.emptyHome}</Text>
      <Text style={styles.emptyBody}>{copy.emptyHomeBody}</Text>
      <TouchableOpacity style={styles.emptyButton} onPress={onReviewRoute} activeOpacity={0.8}>
        <Text style={styles.emptyButtonText}>{copy.reviewRoute}</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Strong Match Banner ────────────────────────────────────────────────────

function StrongMatchBanner() {
  return (
    <View style={styles.matchBanner}>
      <Text style={styles.matchBannerText}>
        🎯 Strong match found — same route, same timing
      </Text>
    </View>
  );
}

// ── Feed Header ────────────────────────────────────────────────────────────

interface FeedHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  hasUnread: boolean;
  showBanner: boolean;
}

function FeedHeader({ searchQuery, onSearchChange, hasUnread, showBanner }: FeedHeaderProps) {
  const { profile } = useOnboarding();
  const firstName = profile?.fullName.split(' ')[0] ?? 'there';

  return (
    <View style={styles.headerContainer}>
      <View style={styles.topBar}>
        <Text style={styles.greeting}>Hi, {firstName} 👋</Text>
        <TouchableOpacity style={styles.bellWrapper} activeOpacity={0.7}>
          <Bell size={iconSizes.lg} color={colors.textPrimary} />
          {hasUnread && <View style={styles.unreadDot} />}
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <MagnifyingGlass size={iconSizes.md} color={colors.textTertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by JNTU, area or name..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={onSearchChange}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      {showBanner && <StrongMatchBanner />}
    </View>
  );
}

// ── Main Screen ────────────────────────────────────────────────────────────

export default function MatchFeed() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: matches, isPending, isError, error, refetch, isRefetching } = useMatches(true);
  const sendInterest = useSendInterest();
  const acceptInterest = useAcceptInterest();

  const cards = useMemo(() => (matches ?? []).map(toCardModel), [matches]);
  const byUserId = useMemo(
    () => new Map((matches ?? []).map((m) => [m.userId, m])),
    [matches]
  );

  const topMatchPercent = cards.reduce((max, c) => Math.max(max, c.matchPercentage), 0);
  const showStrongMatchBanner = topMatchPercent > 90;

  const filteredMatches = searchQuery.trim()
    ? cards.filter(
        (m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.fromLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.toLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.department.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : cards;

  const handleSendInterest = (userId: string) => {
    if (sendInterest.isPending) return;
    sendInterest.mutate(userId, {
      onError: (e) => Alert.alert('Could not send interest', e.message),
    });
  };

  const handleAccept = (userId: string) => {
    const match = byUserId.get(userId);
    if (!match?.incomingInterestId || acceptInterest.isPending) return;
    acceptInterest.mutate(match.incomingInterestId, {
      onError: (e) => Alert.alert('Could not accept', e.message),
    });
  };

  if (isPending) {
    return (
      <View style={styles.screen}>
        <FeedHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          hasUnread
          showBanner={false}
        />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.screen}>
        <FeedHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          hasUnread={false}
          showBanner={false}
        />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            {error instanceof Error ? error.message : copy.errorServer}
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => refetch()}
            activeOpacity={0.8}
          >
            <Text style={styles.emptyButtonText}>{copy.tryAgain}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={filteredMatches}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <FeedHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            hasUnread
            showBanner={showStrongMatchBanner && !searchQuery}
          />
        }
        renderItem={({ item }) => (
          <MatchCard
            match={item}
            onPress={() => {}}
            onSendInterest={() => handleSendInterest(item.id)}
            onAccept={() => handleAccept(item.id)}
            onDecline={() => {}}
            onOpenChat={() => {}}
          />
        )}
        ListEmptyComponent={<EmptyState onReviewRoute={() => refetch()} />}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
      />

      <TouchableOpacity style={styles.fab} onPress={() => console.log('filter')} activeOpacity={0.85}>
        <SlidersHorizontal size={iconSizes.lg} color={colors.textInverse} weight="bold" />
      </TouchableOpacity>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────

type MatchFeedStyles = {
  screen: ViewStyle;
  listContent: ViewStyle;
  headerContainer: ViewStyle;
  topBar: ViewStyle;
  greeting: TextStyle;
  bellWrapper: ViewStyle;
  unreadDot: ViewStyle;
  searchBar: ViewStyle;
  searchInput: TextStyle;
  matchBanner: ViewStyle;
  matchBannerText: TextStyle;
  skeletonCard: ViewStyle;
  skeletonTopRow: ViewStyle;
  skeletonAvatar: ViewStyle;
  skeletonMeta: ViewStyle;
  skeletonLine: ViewStyle;
  emptyContainer: ViewStyle;
  emptyTitle: TextStyle;
  emptyBody: TextStyle;
  emptyButton: ViewStyle;
  emptyButtonText: TextStyle;
  fab: ViewStyle;
};

const styles = StyleSheet.create<MatchFeedStyles>({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  listContent: {
    paddingBottom: spacing.s80,
  },

  // Header
  headerContainer: {
    paddingTop: 60,
    paddingHorizontal: spacing.s20,
    paddingBottom: spacing.s8,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.s16,
  },
  greeting: {
    fontFamily: theme.fontFamilies.displayBold,
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  bellWrapper: {
    position: 'relative',
    padding: spacing.s4,
  },
  unreadDot: {
    position: 'absolute',
    top: spacing.s4,
    right: spacing.s4,
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accent,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },

  // Search bar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s8,
    backgroundColor: palette.neutral100,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.s16,
    paddingVertical: spacing.s10,
    marginBottom: spacing.s12,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.fontSizes.md,
    fontWeight: '400',
    color: colors.textPrimary,
    padding: 0,
  },

  // Strong match banner
  matchBanner: {
    backgroundColor: palette.blue50,
    borderColor: palette.blue200,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.s12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.s12,
  },
  matchBannerText: {
    ...(typography.body2Medium as TextStyle),
    color: colors.primary,
    flex: 1,
  },

  // Skeleton
  skeletonCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    padding: spacing.s16,
    marginHorizontal: theme.layout.screenHorizontalPad,
    marginBottom: spacing.s12,
    ...shadows.sm,
  },
  skeletonTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s12,
    marginBottom: spacing.s12,
  },
  skeletonAvatar: {
    width: components.avatar.md.width,
    height: components.avatar.md.height,
    borderRadius: components.avatar.md.borderRadius,
    backgroundColor: colors.skeletonBase,
  },
  skeletonMeta: {
    flex: 1,
  },
  skeletonLine: {
    height: 14,
    borderRadius: borderRadius.xs,
    backgroundColor: colors.skeletonBase,
  },

  // Empty state
  emptyContainer: {
    alignItems: 'center',
    paddingTop: spacing.s64,
    paddingHorizontal: spacing.s32,
  },
  emptyTitle: {
    ...(typography.h2 as TextStyle),
    textAlign: 'center',
    marginBottom: spacing.s12,
  },
  emptyBody: {
    ...(typography.body2 as TextStyle),
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.s32,
  },
  emptyButton: {
    height: components.button.sm.height,
    borderRadius: components.button.sm.borderRadius,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingHorizontal: spacing.s24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyButtonText: {
    ...(typography.buttonTextSm as TextStyle),
    color: colors.primary,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: spacing.s24,
    right: spacing.s20,
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.accentGlow,
  },
});
