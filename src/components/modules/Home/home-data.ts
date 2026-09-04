export type EventVisibility = 'Public' | 'Private';
export type EventFeeType = 'Free' | 'Paid';

export type HomeEvent = {
  id: string | number;
  title: string;
  image?: string;
  description?: string;
  date: string;
  time?: string;
  venue?: string;
  organizer: string;
  visibility: EventVisibility;
  feeType: EventFeeType;
  fee: number;
  participantCount?: number;
};

export const categoryFilters = [
  { label: 'Public Free', value: 'public-free' },
  { label: 'Public Paid', value: 'public-paid' },
  { label: 'Private Free', value: 'private-free' },
  { label: 'Private Paid', value: 'private-paid' },
] as const;
