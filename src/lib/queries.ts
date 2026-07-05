import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './api';
import type { ConnectionResponse, InterestResponse, MatchResponse } from './apiTypes';

export const queryKeys = {
  matches: ['matches'] as const,
  connections: ['connections'] as const,
  incomingInterests: ['interests', 'incoming'] as const,
};

export function useMatches(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.matches,
    queryFn: () => api.get<MatchResponse[]>('/api/matches'),
    enabled,
    staleTime: 60_000,
    retry: (failureCount, error) => {
      // 401/403 won't heal by retrying; network blips might.
      const status = (error as { status?: number }).status ?? 0;
      return status !== 401 && status !== 403 && failureCount < 2;
    },
  });
}

export function useConnections(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.connections,
    queryFn: () => api.get<ConnectionResponse[]>('/api/connections'),
    enabled,
    staleTime: 60_000,
  });
}

export function useSendInterest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => api.post<InterestResponse>(`/api/interests/${userId}`),
    onSuccess: (_data, userId) => {
      queryClient.setQueryData<MatchResponse[]>(queryKeys.matches, (old) =>
        old?.map((m) =>
          m.userId === userId ? { ...m, outgoingInterestStatus: 'PENDING' as const } : m
        )
      );
    },
  });
}

export function useAcceptInterest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (interestId: string) =>
      api.post<InterestResponse>(`/api/interests/${interestId}/accept`),
    onSuccess: (_data, interestId) => {
      // The accepted student is a connection now — out of the match feed.
      queryClient.setQueryData<MatchResponse[]>(queryKeys.matches, (old) =>
        old?.filter((m) => m.incomingInterestId !== interestId)
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.connections });
    },
  });
}
