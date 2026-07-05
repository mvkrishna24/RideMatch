import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApps, initializeApp } from "firebase/app";
import { getAuth, initializeAuth, type Auth } from "firebase/auth";
import { getFirestore, initializeFirestore, type Firestore } from "firebase/firestore";

// @ts-expect-error — available in Firebase React Native runtime
import { getReactNativePersistence } from "firebase/auth";

// ─────────────────────────────────────────────
// RouteMatch Firebase Configuration
// ─────────────────────────────────────────────

const firebaseConfig = {
  apiKey: "AIzaSyDMbd3ikyAt3ka6QkNDopKV7iLEZMnybhI",
  authDomain: "routemate-550ee.firebaseapp.com",
  projectId: "routemate-550ee",
  storageBucket: "routemate-550ee.firebasestorage.app",
  messagingSenderId: "83513502994",
  appId: "1:83513502994:web:b91df4132443f08da917cb",
  measurementId: "G-YG4E7RNYJP",
};

// Firebase is now configured
export const isFirebaseConfigured = true;

export function assertFirebaseConfigured(): void {
  if (!isFirebaseConfigured) {
    throw Object.assign(new Error("Firebase configuration missing."), {
      code: "routemate/not-configured",
    });
  }
}

// Initialize Firebase
const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);

// Initialize Firebase Auth with React Native persistence
let authInstance: Auth;

try {
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  authInstance = getAuth(app);
}

export const auth = authInstance;

// Firestore (chat only). Auto-detect long polling keeps it working across
// React Native network stacks; try/catch guards fast-refresh double init.
let dbInstance: Firestore;
try {
  dbInstance = initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
} catch {
  dbInstance = getFirestore(app);
}

export const db = dbInstance;

// User friendly Firebase auth errors
export function friendlyAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? "";

  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists. Try signing in instead.";

    case "auth/invalid-email":
      return "That email address doesn't look right.";

    case "auth/weak-password":
      return "Password is too weak — use at least 6 characters.";

    case "auth/wrong-password":
    case "auth/invalid-credential":
    case "auth/user-not-found":
      return "Email or password is incorrect.";

    case "auth/too-many-requests":
      return "Too many attempts. Wait a minute and try again.";

    case "auth/network-request-failed":
      return "No internet connection. Check your network and try again.";

    case "auth/configuration-not-found":
    case "auth/operation-not-allowed":
      return "Sign-in is not enabled on the server yet. Founder: enable Email/Password in the Firebase console.";

    default:
      return "Something went wrong. Please try again.";
  }
}
