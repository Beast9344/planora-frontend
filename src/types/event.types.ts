export type EventVisibility = 'PUBLIC' | 'PRIVATE' | string;
export type EventFeeType = 'FREE' | 'PAID' | string;
export type EventStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | string;

export interface EventViewModel {
  id: string;
  ownerId?: string;
  image?: string;
  title: string;
  description: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  eventLink?: string;
  visibility: EventVisibility;
  feeType: EventFeeType;
  status?: EventStatus;
  registrationFee: number;
  organizerName: string;
  totalParticipants?: number;
  totalReviews?: number;
  totalInvitations?: number;
}

export interface ReviewViewModel {
  id: string;
  rating: number;
  review: string;
  userName: string;
  eventId?: string;
  eventTitle?: string;
  createdAt: string;
}

export interface InvitationViewModel {
  id: string;
  status: string;
  eventTitle: string;
  eventId: string;
  createdAt: string;
}

export interface ParticipationViewModel {
  id: string;
  status: string;
  paymentStatus: string;
  eventTitle: string;
  eventId: string;
  eventStatus?: string;
  registrationFee: number;
  createdAt: string;
}
