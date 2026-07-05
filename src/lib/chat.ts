import {
  addDoc,
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  type Timestamp,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { auth, db } from './firebase';

// Firestore layout:
//   chats/{connectionId}                — room doc: participants (firebase UIDs)
//   chats/{connectionId}/messages/{id}  — { senderUid, text, createdAt }
// connectionId comes from PostgreSQL, so a room can only exist for a pair
// the backend actually connected; the security rules restrict access to
// the two participants.

export interface ChatMessage {
  id: string;
  text: string;
  senderUid: string;
  createdAt: Date | null;
}

const MESSAGE_LIMIT = 100;

/** Firestore errors → copy a student understands (and a founder can act on). */
export function friendlyChatError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? '';
  switch (code) {
    case 'permission-denied':
      return 'This chat is locked. Update the app, or if this keeps happening, report it to the RouteMatch team.';
    case 'unavailable':
      return 'No connection — messages will load when you are back online.';
    case 'unauthenticated':
      return 'You are signed out. Please sign in again.';
    default:
      return 'Chat is unavailable right now. Try again in a moment.';
  }
}

export async function ensureChatRoom(
  connectionId: string,
  partnerFirebaseUid: string
): Promise<void> {
  const myUid = auth.currentUser?.uid;
  if (!myUid) {
    throw new Error('You are signed out.');
  }
  await setDoc(
    doc(db, 'chats', connectionId),
    {
      participants: [myUid, partnerFirebaseUid].sort(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function sendChatMessage(connectionId: string, text: string): Promise<void> {
  const myUid = auth.currentUser?.uid;
  const trimmed = text.trim();
  if (!myUid || !trimmed) {
    return;
  }
  await addDoc(collection(db, 'chats', connectionId, 'messages'), {
    senderUid: myUid,
    text: trimmed,
    createdAt: serverTimestamp(),
  });
  await setDoc(
    doc(db, 'chats', connectionId),
    { lastMessage: trimmed.slice(0, 80), updatedAt: serverTimestamp() },
    { merge: true }
  );
}

/** Live message stream, newest first (for an inverted list). */
export function useChatMessages(connectionId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'chats', connectionId, 'messages'),
      orderBy('createdAt', 'desc'),
      limit(MESSAGE_LIMIT)
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setMessages(
          snapshot.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              text: data.text as string,
              senderUid: data.senderUid as string,
              createdAt: data.createdAt
                ? (data.createdAt as Timestamp).toDate()
                : null,
            };
          })
        );
        setError(null);
        setLoading(false);
      },
      (err) => {
        setError(friendlyChatError(err));
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [connectionId]);

  return { messages, error, loading };
}
