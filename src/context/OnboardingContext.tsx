import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

// Phase 2A: local mock auth + profile state. Phase 2B swaps the storage layer
// for Firebase Auth + backend without changing this context's public API.

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
  signUp: (email: string) => Promise<void>;
  signIn: (email: string) => Promise<void>;
  completeProfile: (profile: CommuteProfile) => Promise<void>;
  signOut: () => Promise<void>;
}

const STORAGE_KEY = 'routemate/onboarding/v1';

interface StoredState {
  email: string | null;
  profile: CommuteProfile | null;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<CommuteProfile | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw && !cancelled) {
          const stored = JSON.parse(raw) as StoredState;
          setEmail(stored.email ?? null);
          setProfile(stored.profile ?? null);
        }
      } catch {
        // Corrupt or unreadable storage → start fresh rather than crash.
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback(async (next: StoredState) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Persistence is best-effort in mock mode.
    }
  }, []);

  const signUp = useCallback(
    async (nextEmail: string) => {
      setEmail(nextEmail);
      await persist({ email: nextEmail, profile: null });
    },
    [persist]
  );

  const signIn = useCallback(
    async (nextEmail: string) => {
      setEmail(nextEmail);
      await persist({ email: nextEmail, profile });
    },
    [persist, profile]
  );

  const completeProfile = useCallback(
    async (nextProfile: CommuteProfile) => {
      setProfile(nextProfile);
      await persist({ email, profile: nextProfile });
    },
    [persist, email]
  );

  const signOut = useCallback(async () => {
    setEmail(null);
    setProfile(null);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch {
      // Best-effort.
    }
  }, []);

  const status: OnboardingStatus = !hydrated
    ? 'loading'
    : email === null
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
