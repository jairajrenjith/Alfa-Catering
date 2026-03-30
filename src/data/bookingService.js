// ─────────────────────────────────────────────────────────────────────────────
// Alfa Catering BKD — Firebase Realtime Database
// Real cross-device sync — all users see the same data instantly
//
// SETUP (one time, ~5 minutes):
//   1. Go to https://console.firebase.google.com → your "alfa-catering" project
//   2. Left sidebar → Build → Realtime Database → Create database
//      → Choose region (asia-southeast1 for India) → Start in TEST mode → Done
//   3. Left sidebar → Project Settings (gear icon) → General tab
//      → Scroll to "Your apps" → click </> (Web) → Register app → name it
//      → Copy the firebaseConfig object shown
//   4. Create a file called .env in your project ROOT (same level as package.json):
//        VITE_FIREBASE_API_KEY=your_api_key
//        VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
//        VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.asia-southeast1.firebasedatabase.app
//        VITE_FIREBASE_PROJECT_ID=your_project_id
//   5. Run in your terminal: npm install firebase
//   6. Run: npm run dev  — done!
// ─────────────────────────────────────────────────────────────────────────────

import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, get, set } from 'firebase/database';

const FIREBASE_CONFIG = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL:       import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialise only once (handles hot-reload)
const app = getApps().length ? getApps()[0] : initializeApp(FIREBASE_CONFIG);
const db  = getDatabase(app);

// ── Keys ──────────────────────────────────────────────────────────────────────
const BOOKINGS_PATH = 'alfa-bkd/bookings';
const SLOTS_PATH    = 'alfa-bkd/slots';

// ── Helpers ───────────────────────────────────────────────────────────────────
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

// ── Bookings ──────────────────────────────────────────────────────────────────
export async function getBookings() {
  const data = await fbGet(BOOKINGS_PATH);
  if (!data) return [];
  // Firebase stores arrays as objects — convert back
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

// ── Slots ─────────────────────────────────────────────────────────────────────
export async function getSharedSlots(fallback) {
  const data = await fbGet(SLOTS_PATH);
  if (!data) return fallback;
  return Array.isArray(data) ? data : Object.values(data);
}

export async function saveSharedSlots(slots) {
  await fbSet(SLOTS_PATH, slots);
}
