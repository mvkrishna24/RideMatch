import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, PaperPlaneRight, ShieldWarning } from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../lib/firebase';
import {
  ensureChatRoom,
  friendlyChatError,
  sendChatMessage,
  useChatMessages,
  type ChatMessage,
} from '../../lib/chat';
import { useBlockUser, useReportUser } from '../../lib/queries';
import { theme } from '../../theme/theme';

const { colors, typography, spacing, borderRadius, components, iconSizes, layout } = theme;

const REPORT_REASONS = ['Safety concern', 'Fake or wrong profile', 'Misbehavior in chat'];

export default function ChatThreadScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    connectionId: string;
    name: string;
    partnerUid: string;
    partnerUserId: string;
  }>();
  const connectionId = params.connectionId;
  const myUid = auth.currentUser?.uid;

  const { messages, error, loading } = useChatMessages(connectionId);
  const [draft, setDraft] = useState('');
  const [roomError, setRoomError] = useState<string | null>(null);
  const blockUser = useBlockUser();
  const reportUser = useReportUser();

  useEffect(() => {
    ensureChatRoom(connectionId, params.partnerUid).catch((e) =>
      setRoomError(friendlyChatError(e))
    );
  }, [connectionId, params.partnerUid]);

  const handleSend = async () => {
    const text = draft;
    setDraft('');
    try {
      await sendChatMessage(connectionId, text);
    } catch {
      setDraft(text);
      Alert.alert('Message not sent', 'Check your connection and try again.');
    }
  };

  const confirmBlock = () => {
    Alert.alert(
      `Block ${params.name}?`,
      'They will disappear from your matches and chats, and can no longer contact you. They are not notified.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block',
          style: 'destructive',
          onPress: () =>
            blockUser.mutate(params.partnerUserId, {
              onSuccess: () => router.back(),
              onError: (e) => Alert.alert('Could not block', e.message),
            }),
        },
      ]
    );
  };

  const chooseReportReason = () => {
    Alert.alert(`Report ${params.name}`, 'Why are you reporting this student?', [
      ...REPORT_REASONS.map((reason) => ({
        text: reason,
        onPress: () =>
          reportUser.mutate(
            { userId: params.partnerUserId, reason },
            {
              onSuccess: () =>
                Alert.alert(
                  'Report received',
                  'Thank you. We review every report within 24 hours.'
                ),
              onError: (e) => Alert.alert('Could not report', e.message),
            }
          ),
      })),
      { text: 'Cancel', style: 'cancel' as const },
    ]);
  };

  const openSafetyMenu = () => {
    Alert.alert('Safety', undefined, [
      { text: 'Report user', onPress: chooseReportReason },
      { text: 'Block user', style: 'destructive', onPress: confirmBlock },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const mine = item.senderUid === myUid;
    return (
      <View style={[styles.bubbleRow, mine ? styles.bubbleRowMine : styles.bubbleRowTheirs]}>
        <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
          <Text style={mine ? styles.bubbleTextMine : styles.bubbleTextTheirs}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.headerBtn}
        >
          <ArrowLeft size={iconSizes.lg} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {params.name}
        </Text>
        <TouchableOpacity
          onPress={openSafetyMenu}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.headerBtn}
        >
          <ShieldWarning size={iconSizes.lg} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Pinned safety message — always visible, not dismissible. */}
      <View style={styles.safetyPin}>
        <Text style={styles.safetyPinText}>
          Meet at the college gate or a public spot for your first ride. Never
          share OTPs, passwords or your exact home address.
        </Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          inverted
          contentContainerStyle={styles.messagesContent}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>
                {roomError ??
                  error ??
                  (loading ? 'Opening chat…' : 'Say hi and agree on a pickup point 👋')}
              </Text>
            </View>
          }
        />

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Message…"
            placeholderTextColor={colors.textTertiary}
            value={draft}
            onChangeText={setDraft}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !draft.trim() && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!draft.trim()}
            activeOpacity={0.8}
          >
            <PaperPlaneRight size={iconSizes.md} color={colors.textInverse} weight="fill" />
          </TouchableOpacity>
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
  header: {
    height: layout.topBarHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.s16,
    gap: spacing.s12,
    backgroundColor: colors.surfaceCard,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  } as ViewStyle,
  headerBtn: {
    width: layout.touchTargetMin,
    height: layout.touchTargetMin,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  headerTitle: {
    ...(typography.h3 as TextStyle),
    flex: 1,
    textAlign: 'center',
  },
  safetyPin: {
    backgroundColor: colors.warningLight,
    paddingHorizontal: spacing.s16,
    paddingVertical: spacing.s10,
  } as ViewStyle,
  safetyPinText: {
    ...(typography.caption as TextStyle),
    color: colors.textPrimary,
  },
  messagesContent: {
    paddingHorizontal: spacing.s16,
    paddingVertical: spacing.s12,
    gap: spacing.s6,
    flexGrow: 1,
  } as ViewStyle,
  bubbleRow: {
    flexDirection: 'row',
  } as ViewStyle,
  bubbleRowMine: {
    justifyContent: 'flex-end',
  } as ViewStyle,
  bubbleRowTheirs: {
    justifyContent: 'flex-start',
  } as ViewStyle,
  bubble: {
    maxWidth: '78%',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.s12,
    paddingVertical: spacing.s8,
  } as ViewStyle,
  bubbleMine: {
    backgroundColor: colors.bubbleSent,
    borderBottomRightRadius: borderRadius.sm,
  } as ViewStyle,
  bubbleTheirs: {
    backgroundColor: colors.bubbleReceived,
    borderBottomLeftRadius: borderRadius.sm,
  } as ViewStyle,
  bubbleTextMine: {
    ...(typography.body2 as TextStyle),
    color: colors.textInverse,
  },
  bubbleTextTheirs: {
    ...(typography.body2 as TextStyle),
    color: colors.textPrimary,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ scaleY: -1 }], // counter the inverted list
  } as ViewStyle,
  emptyText: {
    ...(typography.body2 as TextStyle),
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.s24,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.s8,
    paddingHorizontal: spacing.s16,
    paddingVertical: spacing.s8,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.surfaceCard,
  } as ViewStyle,
  input: {
    flex: 1,
    ...(components.input.default as ViewStyle),
    ...(typography.body1 as TextStyle),
    color: colors.textPrimary,
    maxHeight: 120,
    paddingTop: spacing.s12,
  } as TextStyle,
  sendBtn: {
    width: layout.touchTargetSm,
    height: layout.touchTargetSm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  sendBtnDisabled: {
    backgroundColor: colors.textDisabled,
  } as ViewStyle,
});
