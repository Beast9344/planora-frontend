import { httpClient } from '@/lib/axios/httpClient';

export const platformServices = {
  getAdminStats: async () => {
    return httpClient.get<unknown>('/admin/stats');
  },

  getAdminUsers: async (params?: Record<string, unknown>) => {
    return httpClient.get<unknown>('/admin/users', { params });
  },

  updateAdminUser: async (
    userId: string,
    payload: { status?: 'ACTIVE' | 'BLOCKED' | 'DELETED' },
  ) => {
    return httpClient.patch<unknown>(`/admin/users/${userId}`, payload);
  },

  getEvents: async (params?: Record<string, unknown>) => {
    return httpClient.get<unknown>('/events', { params });
  },

  getEventSearchSuggestions: async (params?: {
    q?: string;
    limit?: number;
  }) => {
    return httpClient.get<unknown>('/events/search-suggestions', { params });
  },

  getPersonalizedEventRecommendations: async (params?: { limit?: number }) => {
    return httpClient.get<unknown>('/events/recommendations', { params });
  },

  getUpcomingEvents: async () => {
    return httpClient.get<unknown>('/events/upcoming');
  },

  getEventById: async (eventId: string) => {
    return httpClient.get<unknown>(`/events/${eventId}`);
  },

  getEventReviews: async (eventId: string) => {
    return httpClient.get<unknown>(`/reviews/events/${eventId}`);
  },

  getMyReviews: async () => {
    return httpClient.get<unknown>('/reviews/me');
  },

  getMyInvitations: async () => {
    return httpClient.get<unknown>('/invitations/me');
  },

  getMyParticipations: async (params?: Record<string, unknown>) => {
    return httpClient.get<unknown>('/participations/me', { params });
  },

  joinEvent: async (eventId: string) => {
    return httpClient.post<unknown>(
      `/participations/events/${eventId}/join`,
      {},
    );
  },

  initiateEventPayment: async (eventId: string) => {
    return httpClient.post<unknown>('/payments/initiate', { eventId });
  },

  getMyPayments: async (params?: Record<string, unknown>) => {
    return httpClient.get<unknown>('/payments/me', { params });
  },

  updateMyProfile: async (payload: { name?: string; image?: string }) => {
    return httpClient.patch<unknown>('/users/me', payload);
  },

  searchUsersForInvitation: async (params: {
    eventId: string;
    searchTerm?: string;
    limit?: number;
  }) => {
    return httpClient.get<unknown>('/users/search', { params });
  },

  validatePaymentTransaction: async (trxId: string) => {
    return httpClient.get<unknown>('/payments/validate', {
      params: { trxId },
    });
  },

  respondInvitation: async (
    invitationId: string,
    action: 'accept' | 'reject',
  ) => {
    return httpClient.patch<unknown>(
      `/invitations/${invitationId}/${action}`,
      {},
    );
  },

  updateParticipationState: async (
    participationId: string,
    action: 'approve' | 'reject' | 'ban',
  ) => {
    return httpClient.patch<unknown>(
      `/participations/${participationId}/${action}`,
      {},
    );
  },

  chatWithAssistant: async (payload: {
    message: string;
    history?: Array<{
      role: 'user' | 'assistant';
      content: string;
    }>;
  }) => {
    return httpClient.post<unknown>('/chatbot/message', payload);
  },
};
