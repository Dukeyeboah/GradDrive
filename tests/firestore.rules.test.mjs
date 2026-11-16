import { readFile } from 'node:fs/promises';
import { after, before, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { doc, setDoc, updateDoc, getDoc, getDocs, collection, query, where, writeBatch, orderBy, limitToLast, Timestamp } from 'firebase/firestore';
let env;
const db = uid => env.authenticatedContext(uid, { email: `${uid}@example.com` }).firestore();
before(async () => { env = await initializeTestEnvironment({ projectId: 'demo-graddrive', firestore: { host: '127.0.0.1', port: 8087, rules: await readFile('firestore.rules', 'utf8') } }); });
after(async () => { await env?.cleanup(); });
beforeEach(async () => { await env.clearFirestore(); });
async function seed(path, value) { await env.withSecurityRulesDisabled(async context => setDoc(doc(context.firestore(), path), value)); }
test('members cannot create or promote administrative roles, but can edit their profile', async () => {
  const alice = db('alice');
  await assertFails(setDoc(doc(alice, 'users/alice'), { role: 'admin', email: 'alice@example.com' }));
  await assertSucceeds(setDoc(doc(alice, 'users/alice'), { role: 'user', email: 'alice@example.com' }));
  await assertFails(updateDoc(doc(alice, 'users/alice'), { role: 'super admin' }));
  await assertFails(updateDoc(doc(alice, 'users/alice'), { email: 'someone@example.com' }));
  await assertSucceeds(updateDoc(doc(alice, 'users/alice'), { displayName: 'Alice' }));
  await seed('users/admin', { role: 'admin' });
  await assertSucceeds(updateDoc(doc(db('admin'), 'users/alice'), { role: 'photographer-admin' }));
});
test('hidden profiles are private even with a direct ID; visible directory queries work', async () => {
  await seed('gradDriverProfiles/alice', { directoryVisible: false });
  await seed('gradDriverProfiles/bob', { directoryVisible: true });
  await assertFails(getDoc(doc(db('bob'), 'gradDriverProfiles/alice')));
  await assertSucceeds(getDoc(doc(db('alice'), 'gradDriverProfiles/alice')));
  const rows = await assertSucceeds(getDocs(query(collection(db('alice'), 'gradDriverProfiles'), where('directoryVisible', '==', true))));
  assert.equal(rows.size, 1);
  await assertFails(getDoc(doc(env.unauthenticatedContext().firestore(), 'gradDriverProfiles/bob')));
});
test('only recipient can accept; request identities cannot be rewritten', async () => {
  const request = { fromUid: 'alice', toUid: 'bob', status: 'pending' };
  await assertSucceeds(setDoc(doc(db('alice'), 'connectionRequests/request'), request));
  await assertFails(updateDoc(doc(db('alice'), 'connectionRequests/request'), { status: 'accepted' }));
  await assertFails(updateDoc(doc(db('bob'), 'connectionRequests/request'), { status: 'accepted', fromUid: 'mallory' }));
  await assertFails(updateDoc(doc(db('bob'), 'connectionRequests/request'), { status: 'invented' }));
  await assertSucceeds(updateDoc(doc(db('bob'), 'connectionRequests/request'), { status: 'declined' }));
});
test('accepted request atomically creates connection and conversation; forged membership is denied', async () => {
  await seed('connectionRequests/request', { fromUid: 'alice', toUid: 'bob', status: 'pending' });
  const bob = db('bob');
  await assertFails(setDoc(doc(bob, 'conversations/alice_bob'), { participantUids: ['alice', 'bob'], requestId: 'request' }));
  const batch = writeBatch(bob);
  batch.update(doc(bob, 'connectionRequests/request'), { status: 'accepted' });
  batch.set(doc(bob, 'connections/alice_bob'), { memberUids: ['alice', 'bob'], requestId: 'request' });
  batch.set(doc(bob, 'conversations/alice_bob'), { participantUids: ['alice', 'bob'], requestId: 'request' });
  await assertSucceeds(batch.commit());
  await assertFails(updateDoc(doc(bob, 'conversations/alice_bob'), { participantUids: ['bob', 'mallory'] }));
  await assertFails(setDoc(doc(bob, 'connections/forged'), { memberUids: ['bob', 'mallory'], requestId: 'request' }));
  await assertFails(getDoc(doc(db('mallory'), 'conversations/alice_bob')));
  await assertSucceeds(setDoc(doc(db('alice'), 'conversations/alice_bob/messages/hello'), { senderUid: 'alice', text: 'Hello' }));
  await assertFails(setDoc(doc(bob, 'conversations/alice_bob/messages/spoof'), { senderUid: 'alice', text: 'Spoof' }));
  await assertFails(setDoc(doc(bob, 'conversations/alice_bob/messages/long'), { senderUid: 'bob', text: 'a'.repeat(4001) }));
  await assertSucceeds(getDocs(query(collection(db('alice'), 'connections'), where('memberUids', 'array-contains', 'alice'))));
});
test('latest message window includes messages after the first 200', async () => {
  await env.withSecurityRulesDisabled(async context => {
    const admin = context.firestore(); const batch = writeBatch(admin);
    batch.set(doc(admin, 'conversations/alice_bob'), { participantUids: ['alice', 'bob'] });
    for (let i = 0; i < 205; i++) batch.set(doc(admin, `conversations/alice_bob/messages/m${i}`), { senderUid: 'alice', text: String(i), createdAt: Timestamp.fromMillis(i * 1000) });
    await batch.commit();
  });
  const rows = await getDocs(query(collection(db('bob'), 'conversations/alice_bob/messages'), orderBy('createdAt', 'asc'), limitToLast(200)));
  assert.equal(rows.size, 200); assert.equal(rows.docs[0].data().text, '5'); assert.equal(rows.docs.at(-1).data().text, '204');
});
