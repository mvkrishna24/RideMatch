import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, type Auth } from 'firebase/auth';
// @ts-expect-error — present in firebase/auth's React Native build at runtime;
// the web type declarations shipped with firebase v12 omit it.
import { getReactNativePersistence } from 'firebase/auth';

// ───────────────────────────────────────────────────────────────────────────
// PASTE YOUR FIREBASE CONFIG HERE.
// Firebase console → Project settings → Your apps → routemate-app (web) →
// "SDK setup and configuration" → Config. Replace the six placeholder values.
// These are public client identifiers — safe to commit. Security lives in
// Firebase rules, not in hiding these.
// ───────────────────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: 'PASTE_FROM_FIREBASE_CONSOLE',
  authDomain: 'PASTE_FROM_FIREBASE_CONSOLE',
  projectId: 'PASTE_FROM_FIREBASE_CONSOLE',
  storageBucket: 'PASTE_FROM_FIREBASE_CONSOLE',
  messagingSenderId: 'PASTE_FROM_FIREBASE_CONSOLE',
  appId: 'PASTE_FROM_FIREBASE_CONSOLE',
};

export const isFirebaseConfigured = !Object.values(firebaseConfig).some((v) =>
  v.startsWith('PASTE_')
);

export function assertFirebaseConfigured(): void {
  if (!isFirebaseConfigured) {
    throw Object.assign(
      new Error('Firebase is not configured yet. Paste your console config into src/lib/firebase.ts.'),
      { code: 'routemate/not-configured' }
    );
  }
}

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);

// initializeAuth may only run once per app instance; fall back to getAuth on
// fast refresh, which re-executes this module against the same app.
let authInstance: Auth;
try {
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  authInstance = getAuth(app);
}

export const auth = authInstance;

/** Maps Firebase auth error codes to copy a student actually understands. */
export function friendlyAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? '';
  switch (code) {
    case 'routemate/not-configured':
      return (err as Error).message;
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try signing in instead.';
    case 'auth/invalid-email':
      return "That email address doesn't look right.";
    case 'auth/weak-password':
      return 'Password is too weak — use at least 6 characters.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
      return 'Email or password is incorrect.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Wait a minute and try again.';
    case 'auth/network-request-failed':
      return 'No internet connection. Check your network and try again.';
    default:
      return 'Something went wrong. Please try again.';
  }
}
