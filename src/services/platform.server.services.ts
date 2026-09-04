import { serverHttpClient } from '@/lib/axios/serverHttpClient';

export const platformServerServices = {
  getDashboardSummary: async () => {
    return serverHttpClient.get<unknown>('/dashboard/summary');
  },

  getDashboardMyEvents: async () => {
    return serverHttpClient.get<unknown>('/events/my-events');
  },

  getMyEvents: async () => {
    return serverHttpClient.get<unknown>('/dashboard/my-events');
  },

  getDashboardPendingApprovals: async () => {
    return serverHttpClient.get<unknown>('/dashboard/pending-approvals');
  },

  getMyPendingApprovals: async () => {
    return serverHttpClient.get<unknown>('/participations/approvals/me');
  },

  getMyEventStatusSummary: async () => {
    return serverHttpClient.get<unknown>('/dashboard/my-event-status-summary');
  },

  getAdminStats: async () => {
    return serverHttpClient.get<unknown>('/admin/stats');
  },

  getAdminReportsSummary: async () => {
    return serverHttpClient.get<unknown>('/admin/reports/summary');
  },

  getAdminUsers: async (params?: Record<string, unknown>) => {
    return serverHttpClient.get<unknown>('/admin/users', { params });
  },

  getAdminUserById: async (userId: string) => {
    return serverHttpClient.get<unknown>(`/admin/users/${userId}`);
  },

  updateAdminUser: async (
    userId: string,
    payload: {
      role?: 'SUPER_ADMIN' | 'ADMIN' | 'USER';
      status?: 'ACTIVE' | 'BLOCKED' | 'DELETED';
    },
  ) => {
    return serverHttpClient.patch<unknown>(`/admin/users/${userId}`, payload);
  },

  getAdminEvents: async (params?: Record<string, unknown>) => {
    return serverHttpClient.get<unknown>('/admin/events', { params });
  },

  getMyProfile: async () => {
    return serverHttpClient.get<unknown>('/users/me');
  },

  getEvents: async (params?: Record<string, unknown>) => {
    return serverHttpClient.get<unknown>('/events', { params });
  },

  getEventSearchSuggestions: async (params?: {
    q?: string;
    limit?: number;
  }) => {
    return serverHttpClient.get<unknown>('/events/search-suggestions', {
      params,
    });
  },

  getPersonalizedEventRecommendations: async (params?: { limit?: number }) => {
    return serverHttpClient.get<unknown>('/events/recommendations', {
      params,
    });
  },

  getUpcomingEvents: async () => {
    return serverHttpClient.get<unknown>('/events/upcoming');
  },

  getEventById: async (eventId: string) => {
    return serverHttpClient.get<unknown>(`/events/${eventId}`);
  },

  getEventReviews: async (eventId: string) => {
    return serverHttpClient.get<unknown>(`/reviews/events/${eventId}`);
  },

  getMyReviews: async () => {
    return serverHttpClient.get<unknown>('/reviews/me');
  },

  getMyInvitations: async () => {
    return serverHttpClient.get<unknown>('/invitations/me');
  },

  getMyParticipations: async (params?: Record<string, unknown>) => {
    return serverHttpClient.get<unknown>('/participations/me', { params });
  },

  getEventParticipants: async (eventId: string) => {
    return serverHttpClient.get<unknown>(`/participations/events/${eventId}`);
  },

  getMyPayments: async (params?: Record<string, unknown>) => {
    return serverHttpClient.get<unknown>('/payments/me', { params });
  },

  validatePaymentTransaction: async (trxId: string) => {
    return serverHttpClient.get<unknown>('/payments/validate', {
      params: { trxId },
    });
  },
};
