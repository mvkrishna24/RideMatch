import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { assertFirebaseConfigured, auth } from '../lib/firebase';

// Firebase owns account identity (Phase 2B). The commute profile still lives
// in AsyncStorage, keyed per Firebase UID, until the backend arrives.

export type Gender = 'female' | 'male' | 'other';
export type Vehicle = 'bike' | 'scooty' | 'car' | 'none';
export type GenderPreference = 'same' | 'any';

export interface CommuteProfile {
  fullName: string;
  college: string;
  year: string;
  branch: string;
  gender: Gender;
  fromArea: string;
  landmark: string;
  arrivalSlot: string;
  returnSlot: string;
  activeDays: string[];
  vehicle: Vehicle;
  genderPreference: GenderPreference;
  emergencyContact: string;
}

export type OnboardingStatus = 'loading' | 'signedOut' | 'needsProfile' | 'complete';

interface OnboardingContextValue {
  status: OnboardingStatus;
  email: string | null;
  profile: CommuteProfile | null;
  signUp: (email: string, password: string) => Promise<void>;
  /** Resolves to where the signed-in account stands, so screens can route. */
  signIn: (email: string, password: string) => Promise<'complete' | 'needsProfile'>;
  completeProfile: (profile: CommuteProfile) => Promise<void>;
  signOut: () => Promise<void>;
}

const LEGACY_STORAGE_KEY = 'routemate/onboarding/v1';
const profileKey = (uid: string) => `routemate/profile/v1/${uid}`;

async function loadStoredProfile(uid: string): Promise<CommuteProfile | null> {
  try {
    const raw = await AsyncStorage.getItem(profileKey(uid));
    return raw ? (JSON.parse(raw) as CommuteProfile) : null;
  } catch {
    return null;
  }
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [uid, setUid] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<CommuteProfile | null>(null);

  useEffect(() => {
    // Pre-Firebase mock state is dead weight now; clear it once.
    AsyncStorage.removeItem(LEGACY_STORAGE_KEY).catch(() => {});

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const stored = await loadStoredProfile(user.uid);
        setUid(user.uid);
        setEmail(user.email);
        setProfile(stored);
      } else {
        setUid(null);
        setEmail(null);
        setProfile(null);
      }
      setHydrated(true);
    });
    return unsubscribe;
  }, []);

  const signUp = useCallback(async (nextEmail: string, password: string) => {
    assertFirebaseConfigured();
    await createUserWithEmailAndPassword(auth, nextEmail, password);
    // onAuthStateChanged updates state; a fresh account has no profile yet.
  }, []);

  const signIn = useCallback(
    async (nextEmail: string, password: string): Promise<'complete' | 'needsProfile'> => {
      assertFirebaseConfigured();
      const cred = await signInWithEmailAndPassword(auth, nextEmail, password);
      const stored = await loadStoredProfile(cred.user.uid);
      return stored ? 'complete' : 'needsProfile';
    },
    []
  );

  const completeProfile = useCallback(
    async (nextProfile: CommuteProfile) => {
      if (!uid) {
        throw new Error('Cannot save a profile without a signed-in account.');
      }
      setProfile(nextProfile);
      try {
        await AsyncStorage.setItem(profileKey(uid), JSON.stringify(nextProfile));
      } catch {
        // Best-effort until the backend owns profiles.
      }
    },
    [uid]
  );

  const signOut = useCallback(async () => {
    // The per-UID profile stays stored so signing back in restores it.
    await firebaseSignOut(auth);
  }, []);

  const status: OnboardingStatus = !hydrated
    ? 'loading'
    : uid === null
      ? 'signedOut'
      : profile === null
        ? 'needsProfile'
        : 'complete';

  const value = useMemo(
    () => ({ status, email, profile, signUp, signIn, completeProfile, signOut }),
    [status, email, profile, signUp, signIn, completeProfile, signOut]
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error('useOnboarding must be used inside OnboardingProvider');
  }
  return ctx;
}
