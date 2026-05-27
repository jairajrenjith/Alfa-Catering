import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, get, set } from 'firebase/database';
import { getAuth, signInAnonymously } from "firebase/auth";

const FIREBASE_CONFIG = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL:       import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(FIREBASE_CONFIG);
const db  = getDatabase(app);

const auth = getAuth();

signInAnonymously(auth)
  .then(() => console.log("Auth success"))
  .catch(console.error);

const BOOKINGS_PATH = 'alfa-bkd/bookings';
const SLOTS_PATH    = 'alfa-bkd/slots';

async function fbGet(path) {
  try {
    const snap = await get(ref(db, path));
    return snap.exists() ? snap.val() : null;
  } catch (e) {
    console.error('Firebase read error:', e);
    return null;
  }
}

async function fbSet(path, value) {
  try {
    await set(ref(db, path), value);
    return true;
  } catch (e) {
    console.error('Firebase write error:', e);
    return false;
  }
}

export async function getBookings() {
  const data = await fbGet(BOOKINGS_PATH);
  if (!data) return [];
  return Array.isArray(data) ? data : Object.values(data);
}

export async function addBooking(booking) {
  const existing = await getBookings();
  const updated = [
    ...existing,
    {
      ...booking,
      id: Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    },
  ];
  await fbSet(BOOKINGS_PATH, updated);
  return updated;
}

export async function updateBookingStatus(id, status) {
  const existing = await getBookings();
  const updated = existing.map(b => b.id === id ? { ...b, status } : b);
  await fbSet(BOOKINGS_PATH, updated);
  return updated;
}

export async function deleteBooking(id) {
  const existing = await getBookings();
  const updated = existing.filter(b => b.id !== id);
  await fbSet(BOOKINGS_PATH, updated);
  return updated;
}

export async function getSharedSlots(fallback) {
  const data = await fbGet(SLOTS_PATH);
  if (!data) return fallback;
  return Array.isArray(data) ? data : Object.values(data);
}

export async function saveSharedSlots(slots) {
  await fbSet(SLOTS_PATH, slots);
}
