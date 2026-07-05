import Constants from 'expo-constants';
import { auth } from './firebase';

/**
 * Base URL resolution, in priority order:
 *  1. EXPO_PUBLIC_API_URL env var (production builds, tunnels, overrides)
 *  2. The Expo dev server's own host — in Expo Go, Metro runs on the same
 *     machine as Spring Boot, so reuse its LAN IP instead of hardcoding one.
 *  3. localhost (web / last resort)
 */
function resolveBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv) {
    return fromEnv.replace(/\/$/, '');
  }
  const hostUri = Constants.expoConfig?.hostUri;
  const host = hostUri?.split(':')[0];
  if (host) {
    return `http://${host}:8080`;
  }
  if (!__DEV__) {
    // A release build with no EXPO_PUBLIC_API_URL cannot reach any backend.
    console.warn(
      'EXPO_PUBLIC_API_URL is not set — set it in eas.json before distributing builds.'
    );
  }
  return 'http://localhost:8080';
}

export const API_BASE_URL = resolveBaseUrl();

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const user = auth.currentUser;
  if (!user) {
    throw new ApiError('You are signed out. Please sign in again.', 401);
  }

  // getIdToken() returns the cached token and transparently refreshes it
  // when close to expiry — no manual token management needed.
  const token = await user.getIdToken();

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError('Could not reach RouteMatch servers. Check your connection.', 0);
  }

  if (response.status === 401) {
    throw new ApiError('Your session expired. Please sign in again.', 401);
  }

  if (!response.ok) {
    let message = 'Something went wrong. Please try again.';
    try {
      const body = (await response.json()) as { title?: string; error?: string };
      message = body.title ?? body.error ?? message;
    } catch {
      // Non-JSON error body — keep the generic message.
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
};
