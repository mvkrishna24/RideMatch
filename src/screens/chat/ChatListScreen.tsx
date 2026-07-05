import { useRouter } from 'expo-router';
import { CaretRight, SealCheck } from 'phosphor-react-native';
import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLLEGE_SHORT } from '../../constants/profileOptions';
import { useOnboarding } from '../../context/OnboardingContext';
import type { ConnectionResponse } from '../../lib/apiTypes';
import { useConnections } from '../../lib/queries';
import { theme } from '../../theme/theme';

const { colors, typography, spacing, components, iconSizes, copy } = theme;

function initials(name: string | null): string {
  if (!name) return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

export default function ChatListScreen() {
  const router = useRouter();
  const { status } = useOnboarding();
  const { data: connections, isPending } = useConnections(status === 'complete');

  const openThread = (connection: ConnectionResponse) => {
    router.push({
      pathname: '/chat/[connectionId]',
      params: {
        connectionId: connection.id,
        name: connection.user.name ?? 'Ride match',
        partnerUid: connection.partnerFirebaseUid,
        partnerUserId: connection.user.userId,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>Chats</Text>
      <FlatList
        data={connections ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              {isPending ? 'Loading your ride matches…' : copy.emptyMessages}
            </Text>
            {!isPending && (
              <Text style={styles.emptyBody}>
                When you and a match both say yes, your chat starts here.
              </Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => openThread(item)}
            activeOpacity={0.7}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials(item.user.name)}</Text>
            </View>
            <View style={styles.rowBody}>
              <View style={styles.nameRow}>
                <Text style={styles.name} numberOfLines={1}>
                  {item.user.name ?? 'Ride match'}
                </Text>
                <SealCheck size={iconSizes.sm} color={colors.primary} weight="fill" />
              </View>
              <Text style={styles.meta} numberOfLines={1}>
                {item.user.fromArea ?? 'On your route'} → {COLLEGE_SHORT}
              </Text>
            </View>
            <CaretRight size={iconSizes.md} color={colors.textTertiary} />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface,
  } as ViewStyle,
  title: {
    ...(typography.h1 as TextStyle),
    paddingHorizontal: spacing.s20,
    paddingTop: spacing.s16,
    paddingBottom: spacing.s12,
  },
  listContent: {
    paddingHorizontal: spacing.s20,
    paddingBottom: spacing.s24,
    gap: spacing.s8,
    flexGrow: 1,
  } as ViewStyle,
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s12,
    ...(components.card.flat as ViewStyle),
  } as ViewStyle,
  avatar: {
    width: components.avatar.md.width,
    height: components.avatar.md.height,
    borderRadius: components.avatar.md.borderRadius,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  avatarText: {
    ...(typography.body1SemiBold as TextStyle),
    color: colors.primary,
  },
  rowBody: {
    flex: 1,
    gap: spacing.s2,
  } as ViewStyle,
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s6,
  } as ViewStyle,
  name: {
    ...(typography.body1SemiBold as TextStyle),
    flexShrink: 1,
  },
  meta: {
    ...(typography.caption as TextStyle),
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.s8,
    paddingHorizontal: spacing.s24,
  } as ViewStyle,
  emptyTitle: {
    ...(typography.h3 as TextStyle),
    textAlign: 'center',
  },
  emptyBody: {
    ...(typography.body2 as TextStyle),
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
