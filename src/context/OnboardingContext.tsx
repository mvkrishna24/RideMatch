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

import { api } from '../lib/api';
import type { ApiVerificationStatus, UserResponse } from '../lib/apiTypes';
import { assertFirebaseConfigured, auth } from '../lib/firebase';
import {
  fromUserResponse,
  toCommuteRequest,
  toUpdateMeRequest,
} from '../lib/profileMapper';

// Phase 3A: Firebase owns identity, PostgreSQL owns the profile.
// AsyncStorage keeps only a read cache so a cold start without network
// still opens the app; the backend remains the source of truth.

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
  verificationStatus: ApiVerificationStatus | null;
  signUp: (email: string, password: string) => Promise<void>;
  /** Resolves to where the signed-in account stands, so screens can route. */
  signIn: (email: string, password: string) => Promise<'complete' | 'needsProfile'>;
  completeProfile: (profile: CommuteProfile) => Promise<void>;
  signOut: () => Promise<void>;
}

const cacheKey = (uid: string) => `routemate/profile-cache/v2/${uid}`;

interface CachedState {
  profile: CommuteProfile | null;
  verificationStatus: ApiVerificationStatus | null;
}

async function readCache(uid: string): Promise<CachedState | null> {
  try {
    const raw = await AsyncStorage.getItem(cacheKey(uid));
    return raw ? (JSON.parse(raw) as CachedState) : null;
  } catch {
    return null;
  }
}

async function writeCache(uid: string, state: CachedState): Promise<void> {
  try {
    await AsyncStorage.setItem(cacheKey(uid), JSON.stringify(state));
  } catch {
    // Cache is best-effort by definition.
  }
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [uid, setUid] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<CommuteProfile | null>(null);
  const [verificationStatus, setVerificationStatus] =
    useState<ApiVerificationStatus | null>(null);

  const applyUserResponse = useCallback((userUid: string, user: UserResponse) => {
    const nextProfile = fromUserResponse(user);
    setProfile(nextProfile);
    setVerificationStatus(user.verificationStatus);
    writeCache(userUid, {
      profile: nextProfile,
      verificationStatus: user.verificationStatus,
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUid(null);
        setEmail(null);
        setProfile(null);
        setVerificationStatus(null);
        setHydrated(true);
        return;
      }

      setUid(user.uid);
      setEmail(user.email);
      try {
        const synced = await api.post<UserResponse>('/api/auth/sync');
        applyUserResponse(user.uid, synced);
      } catch {
        // Offline or backend unreachable: fall back to the last known
        // server state so the app still opens. Next sync overwrites it.
        const cached = await readCache(user.uid);
        setProfile(cached?.profile ?? null);
        setVerificationStatus(cached?.verificationStatus ?? null);
      }
      setHydrated(true);
    });
    return unsubscribe;
  }, [applyUserResponse]);

  const signUp = useCallback(async (nextEmail: string, password: string) => {
    assertFirebaseConfigured();
    await createUserWithEmailAndPassword(auth, nextEmail, password);
    // onAuthStateChanged fires next and runs /api/auth/sync.
  }, []);

  const signIn = useCallback(
    async (nextEmail: string, password: string): Promise<'complete' | 'needsProfile'> => {
      assertFirebaseConfigured();
      const cred = await signInWithEmailAndPassword(auth, nextEmail, password);
      try {
        const synced = await api.post<UserResponse>('/api/auth/sync');
        applyUserResponse(cred.user.uid, synced);
        return fromUserResponse(synced) ? 'complete' : 'needsProfile';
      } catch {
        const cached = await readCache(cred.user.uid);
        return cached?.profile ? 'complete' : 'needsProfile';
      }
    },
    [applyUserResponse]
  );

  const completeProfile = useCallback(
    async (nextProfile: CommuteProfile) => {
      if (!uid) {
        throw new Error('Cannot save a profile without a signed-in account.');
      }
      await api.put<UserResponse>('/api/me', toUpdateMeRequest(nextProfile));
      await api.put('/api/commute', toCommuteRequest(nextProfile));
      const fresh = await api.get<UserResponse>('/api/me');
      applyUserResponse(uid, fresh);
    },
    [uid, applyUserResponse]
  );

  const signOut = useCallback(async () => {
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
    () => ({
      status,
      email,
      profile,
      verificationStatus,
      signUp,
      signIn,
      completeProfile,
      signOut,
    }),
    [status, email, profile, verificationStatus, signUp, signIn, completeProfile, signOut]
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
