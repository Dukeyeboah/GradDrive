import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  writeBatch,
  limitToLast,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export type ConnectionRequest = {
  id: string;
  fromUid: string;
  toUid: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt?: { toDate: () => Date };
  updatedAt?: { toDate: () => Date };
};

export type Conversation = {
  id: string;
  participantUids: string[];
  lastMessageText?: string;
  lastMessageAt?: { toDate: () => Date };
  createdAt?: { toDate: () => Date };
};

export type ChatMessage = {
  id: string;
  senderUid: string;
  text: string;
  createdAt?: { toDate: () => Date };
};

export function connectionPairId(uidA: string, uidB: string): string {
  return [uidA, uidB].sort().join('_');
}

export async function getConnectionRequestBetween(
  uidA: string,
  uidB: string,
): Promise<ConnectionRequest | null> {
  const q1 = query(
    collection(db, 'connectionRequests'),
    where('fromUid', '==', uidA),
    where('toUid', '==', uidB),
  );
  const q2 = query(
    collection(db, 'connectionRequests'),
    where('fromUid', '==', uidB),
    where('toUid', '==', uidA),
  );
  const [s1, s2] = await Promise.all([getDocs(q1), getDocs(q2)]);
  const candidates = [...s1.docs, ...s2.docs];
  const snap = candidates.find(d => d.data().status === 'accepted') ?? candidates.find(d => d.data().status === 'pending') ?? candidates[0];
  if (!snap) return null;
  return { id: snap.id, ...(snap.data() as Omit<ConnectionRequest, 'id'>) };
}

export async function getAcceptedConnection(
  myUid: string,
  otherUid: string,
): Promise<boolean> {
  const snap = await getDocs(query(collection(db, 'connections'), where('memberUids', 'array-contains', myUid)));
  return snap.docs.some(d => d.id === connectionPairId(myUid, otherUid));
}

export type ConnectUiState =
  | 'self'
  | 'connected'
  | 'none'
  | 'outgoing_pending'
  | 'incoming_pending';

export async function getConnectUiState(
  myUid: string,
  otherUid: string,
): Promise<ConnectUiState> {
  if (myUid === otherUid) return 'self';
  if (await getAcceptedConnection(myUid, otherUid)) return 'connected';
  const req = await getConnectionRequestBetween(myUid, otherUid);
  if (!req || req.status === 'declined') return 'none';
  if (req.status === 'accepted') return 'connected';
  if (req.status === 'pending' && req.fromUid === myUid) return 'outgoing_pending';
  if (req.status === 'pending' && req.toUid === myUid) return 'incoming_pending';
  return 'none';
}

export async function sendConnectionRequest(
  fromUid: string,
  toUid: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (fromUid === toUid) {
    return { ok: false, error: 'You cannot connect with yourself.' };
  }
  const existing = await getConnectionRequestBetween(fromUid, toUid);
  if (existing?.status === 'pending') {
    return { ok: false, error: 'A connection request is already pending.' };
  }
  if (existing?.status === 'accepted' || (await getAcceptedConnection(fromUid, toUid))) {
    return { ok: false, error: 'You are already connected.' };
  }
  await addDoc(collection(db, 'connectionRequests'), {
    fromUid,
    toUid,
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { ok: true };
}

export async function respondConnectionRequest(
  requestId: string,
  toUid: string,
  accept: boolean,
): Promise<{ ok: true; conversationId?: string } | { ok: false; error: string }> {
  const ref = doc(db, 'connectionRequests', requestId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return { ok: false, error: 'Request not found.' };
  const data = snap.data() as Omit<ConnectionRequest, 'id'>;
  if (data.toUid !== toUid) return { ok: false, error: 'Not allowed.' };
  if (data.status !== 'pending') {
    return { ok: false, error: 'This request was already handled.' };
  }

  if (!accept) {
    await updateDoc(ref, {
      status: 'declined',
      updatedAt: serverTimestamp(),
    });
    return { ok: true };
  }

  const pairId = connectionPairId(data.fromUid, data.toUid);
  const batch = writeBatch(db);
  batch.update(ref, { status: 'accepted', updatedAt: serverTimestamp() });
  batch.set(doc(db, 'connections', pairId), {
    memberUids: [data.fromUid, data.toUid], requestId, createdAt: serverTimestamp(),
  });
  batch.set(doc(db, 'conversations', pairId), {
    participantUids: [data.fromUid, data.toUid], requestId,
    createdAt: serverTimestamp(), lastMessageAt: serverTimestamp(), lastMessageText: '',
  });
  await batch.commit();
  return { ok: true, conversationId: pairId };
}

export async function listIncomingConnectionRequests(
  toUid: string,
): Promise<ConnectionRequest[]> {
  const mapDocs = (snap: Awaited<ReturnType<typeof getDocs>>) =>
    snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<ConnectionRequest, 'id'>),
    }));

  try {
    const snap = await getDocs(
      query(
        collection(db, 'connectionRequests'),
        where('toUid', '==', toUid),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc'),
        limit(50),
      ),
    );
    return mapDocs(snap);
  } catch (primaryError) {
    try {
      const snap = await getDocs(
        query(
          collection(db, 'connectionRequests'),
          where('toUid', '==', toUid),
          where('status', '==', 'pending'),
        ),
      );
      return mapDocs(snap);
    } catch (fallbackError) {
      console.error(
        'listIncomingConnectionRequests failed:',
        primaryError,
        fallbackError,
      );
      return [];
    }
  }
}

export async function listMyConversations(
  myUid: string,
): Promise<Conversation[]> {
  const q = query(
    collection(db, 'conversations'),
    where('participantUids', 'array-contains', myUid),
    orderBy('lastMessageAt', 'desc'),
    limit(50),
  );
  try {
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Conversation, 'id'>),
    }));
  } catch {
    const snap = await getDocs(
      query(
        collection(db, 'conversations'),
        where('participantUids', 'array-contains', myUid),
      ),
    );
    const list = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Conversation, 'id'>),
    }));
    list.sort((a, b) => {
      const ta = a.lastMessageAt?.toDate?.()?.getTime() ?? 0;
      const tb = b.lastMessageAt?.toDate?.()?.getTime() ?? 0;
      return tb - ta;
    });
    return list;
  }
}

export async function sendChatMessage(
  conversationId: string,
  senderUid: string,
  text: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const trimmed = text.trim();
  if (!trimmed) return { ok: false, error: 'Message cannot be empty.' };
  if (trimmed.length > 4000) return { ok: false, error: 'Keep messages under 4,000 characters.' };

  const convRef = doc(db, 'conversations', conversationId);
  const convSnap = await getDoc(convRef);
  if (!convSnap.exists()) return { ok: false, error: 'Conversation not found.' };
  const participants = convSnap.data()?.participantUids as string[] | undefined;
  if (!participants?.includes(senderUid)) {
    return { ok: false, error: 'Not a participant.' };
  }

  const batch = writeBatch(db);
  batch.set(doc(collection(db, 'conversations', conversationId, 'messages')), {
    senderUid,
    text: trimmed,
    createdAt: serverTimestamp(),
  });
  batch.update(convRef, {
    lastMessageText: trimmed.slice(0, 200),
    lastMessageAt: serverTimestamp(),
  });
  await batch.commit();
  return { ok: true };
}

export function subscribeChatMessages(
  conversationId: string,
  onMessages: (messages: ChatMessage[]) => void,
): Unsubscribe {
  const q = query(
    collection(db, 'conversations', conversationId, 'messages'),
    orderBy('createdAt', 'asc'),
    limitToLast(200),
  );
  return onSnapshot(q, (snap) => {
    onMessages(
      snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<ChatMessage, 'id'>),
      })),
    );
  });
}

export async function getConversationForPair(
  myUid: string,
  otherUid: string,
): Promise<string | null> {
  const id = connectionPairId(myUid, otherUid);
  const snap = await getDoc(doc(db, 'conversations', id));
  return snap.exists() ? id : null;
}
