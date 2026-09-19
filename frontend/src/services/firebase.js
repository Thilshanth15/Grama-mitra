// Firebase configuration
// Replace with your actual Firebase config values
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, onSnapshot, doc, updateDoc, serverTimestamp, where } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// ── Auth helpers ──
export const loginAdmin = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const loginGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};
export const logoutAdmin = () => signOut(auth);
export const onAuthChange = (cb) => onAuthStateChanged(auth, cb);

// ── Demo mode flag ──
const isDemo = !import.meta.env.VITE_FIREBASE_PROJECT_ID || import.meta.env.VITE_FIREBASE_PROJECT_ID === 'demo-project';

// ── In-memory store for demo mode ──
const store = {
  queries: [],
  handoffs: [],
  safetyAlerts: [],
  callLogs: generateDemoCallLogs(),
};

function generateDemoCallLogs() {
  return Array.from({ length: 12 }, (_, i) => ({
    id: `call-${i + 1}`,
    channel: ['WhatsApp', 'IVR', 'Website'][i % 3],
    duration: `${Math.floor(Math.random() * 5) + 1}m ${Math.floor(Math.random() * 59)}s`,
    category: ['AGRICULTURE', 'GOVERNMENT_SCHEME', 'HEALTH', 'GENERAL'][i % 4],
    status: ['Completed', 'Missed', 'Completed', 'Completed'][i % 4],
    handoff: i % 5 === 0,
    simulated: true,
    createdAt: new Date(Date.now() - i * 3600000).toISOString(),
  }));
}

let idCounter = 1;
function genId(prefix) { return `${prefix}-${Date.now()}-${idCounter++}`; }

// ── Queries ──
export async function saveQuery(queryData) {
  const record = {
    ...queryData,
    id: genId('q'),
    createdAt: new Date().toISOString(),
  };
  if (isDemo) {
    store.queries.unshift(record);
    return record;
  }
  const docRef = await addDoc(collection(db, 'queries'), { ...queryData, createdAt: serverTimestamp() });
  return { ...queryData, id: docRef.id };
}

export async function getQueries(limitN = 50) {
  if (isDemo) return store.queries.slice(0, limitN);
  const q = query(collection(db, 'queries'), orderBy('createdAt', 'desc'), limit(limitN));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ── Handoffs ──
export async function saveHandoff(handoffData) {
  const record = {
    ...handoffData,
    id: genId('h'),
    status: 'Pending',
    createdAt: new Date().toISOString(),
    assignedTo: null,
    adminNotes: '',
  };
  if (isDemo) {
    store.handoffs.unshift(record);
    return record;
  }
  const docRef = await addDoc(collection(db, 'handoffs'), { ...handoffData, status: 'Pending', createdAt: serverTimestamp() });
  return { ...handoffData, id: docRef.id };
}

export async function getHandoffs() {
  if (isDemo) return store.handoffs;
  const q = query(collection(db, 'handoffs'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function updateHandoffStatus(id, status, notes = '') {
  if (isDemo) {
    const item = store.handoffs.find(h => h.id === id);
    if (item) { item.status = status; item.adminNotes = notes; }
    return;
  }
  await updateDoc(doc(db, 'handoffs', id), { status, adminNotes: notes });
}

// ── Safety Alerts ──
export async function saveSafetyAlert(alertData) {
  const record = {
    ...alertData,
    id: genId('alert'),
    status: 'Active',
    createdAt: new Date().toISOString(),
  };
  if (isDemo) {
    store.safetyAlerts.unshift(record);
    return record;
  }
  const docRef = await addDoc(collection(db, 'safety_alerts'), { ...alertData, status: 'Active', createdAt: serverTimestamp() });
  return { ...alertData, id: docRef.id };
}

export async function getSafetyAlerts() {
  if (isDemo) return store.safetyAlerts;
  const q = query(collection(db, 'safety_alerts'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ── Call Logs ──
export async function getCallLogs() {
  return store.callLogs; // always simulated in MVP
}

// ── Analytics ──
export async function getAnalytics() {
  const queries = isDemo ? store.queries : await getQueries(200);
  const handoffs = isDemo ? store.handoffs : await getHandoffs();
  const alerts = isDemo ? store.safetyAlerts : await getSafetyAlerts();

  const categoryCount = { AGRICULTURE: 0, GOVERNMENT_SCHEME: 0, HEALTH: 0, GENERAL: 0, EMERGENCY: 0 };
  const channelCount = { Website: 0, WhatsApp: 0, IVR: 0 };
  const statusCount = { Resolved: 0, Pending: 0, Escalated: 0 };

  queries.forEach(q => {
    if (categoryCount[q.category] !== undefined) categoryCount[q.category]++;
    if (channelCount[q.channel] !== undefined) channelCount[q.channel]++;
    if (statusCount[q.status] !== undefined) statusCount[q.status]++;
  });

  // Build last 7 days trend
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString('en-IN', { weekday: 'short' });
    const count = queries.filter(q => {
      const qd = new Date(q.createdAt);
      return qd.toDateString() === d.toDateString();
    }).length;
    days.push({ day: label, queries: count });
  }

  return {
    totalQueries: queries.length,
    todayQueries: queries.filter(q => new Date(q.createdAt).toDateString() === new Date().toDateString()).length,
    pendingHandoffs: handoffs.filter(h => h.status === 'Pending').length,
    healthAlerts: alerts.filter(a => a.status === 'Active').length,
    categoryDistribution: Object.entries(categoryCount).map(([name, value]) => ({ name, value })),
    channelDistribution: Object.entries(channelCount).map(([name, value]) => ({ name, value })),
    queryTrend: days,
    handoffRate: queries.length ? Math.round((handoffs.length / queries.length) * 100) : 0,
  };
}
