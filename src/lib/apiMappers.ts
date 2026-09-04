import {
  EventViewModel,
  InvitationViewModel,
  ParticipationViewModel,
  ReviewViewModel,
} from '@/types/event.types';

const asRecord = (value: unknown): Record<string, unknown> => {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : {};
};

const pickString = (value: unknown, fallback = ''): string => {
  return typeof value === 'string' ? value : fallback;
};

const pickNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
};

const getDateTimeParts = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return {
      date: value || 'TBD',
      time: '',
    };
  }

  return {
    date: parsed.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    time: parsed.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }),
  };
};

export const extractArrayPayload = (data: unknown): unknown[] => {
  if (Array.isArray(data)) {
    return data;
  }

  const record = asRecord(data);

  if (Array.isArray(record.result)) {
    return record.result;
  }

  if (Array.isArray(record.items)) {
    return record.items;
  }

  if (Array.isArray(record.data)) {
    return record.data;
  }

  return [];
};

export const mapEvent = (input: unknown): EventViewModel => {
  const item = asRecord(input);
  const organizer = asRecord(item.organizer);
  const owner = asRecord(item.owner);
  const host = asRecord(item.host);
  const createdBy = asRecord(item.createdBy);
  const aggregate = asRecord(item._count);
  const dateTimeSource =
    pickString(item.eventDateTime) ||
    pickString(item.eventDate) ||
    pickString(item.date);
  const dateTimeParts = getDateTimeParts(dateTimeSource);

  return {
    id: pickString(item.id, pickString(item._id, '')),
    ownerId: pickString(item.ownerId, pickString(owner.id, '')),
    image: pickString(item.image),
    title: pickString(item.title, 'Untitled event'),
    description: pickString(item.description, 'No description available.'),
    eventDate: dateTimeParts.date,
    eventTime: pickString(item.eventTime, dateTimeParts.time),
    venue: pickString(item.venue, pickString(item.location, 'TBA')),
    eventLink: pickString(item.eventLink),
    visibility: pickString(item.visibility, 'PUBLIC'),
    feeType: pickString(item.feeType, 'FREE'),
    status: pickString(item.status, 'ACTIVE'),
    registrationFee: pickNumber(item.registrationFee, 0),
    organizerName:
      pickString(organizer.name) ||
      pickString(owner.name) ||
      pickString(host.name) ||
      pickString(createdBy.name) ||
      pickString(item.organizerName, 'Unknown organizer'),
    totalParticipants: pickNumber(aggregate.participants, 0),
    totalReviews: pickNumber(aggregate.reviews, 0),
    totalInvitations: pickNumber(aggregate.eventInvitations, 0),
  };
};

export const mapReview = (input: unknown): ReviewViewModel => {
  const item = asRecord(input);
  const user = asRecord(item.user);
  const event = asRecord(item.event);

  return {
    id: pickString(item.id, pickString(item._id, '')),
    rating: pickNumber(item.rating, 0),
    review: pickString(item.review, ''),
    userName: pickString(user.name, pickString(item.userName, 'Anonymous')),
    eventId: pickString(event.id, pickString(item.eventId, '')),
    eventTitle: pickString(
      event.title,
      pickString(item.eventTitle, 'Untitled event'),
    ),
    createdAt: pickString(item.createdAt, ''),
  };
};

export const mapInvitation = (input: unknown): InvitationViewModel => {
  const item = asRecord(input);
  const event = asRecord(item.event);

  return {
    id: pickString(item.id, pickString(item._id, '')),
    status: pickString(item.status, 'PENDING'),
    eventTitle: pickString(
      event.title,
      pickString(item.eventTitle, 'Untitled event'),
    ),
    eventId: pickString(event.id, pickString(item.eventId, '')),
    createdAt: pickString(item.createdAt, ''),
  };
};

export const mapParticipation = (input: unknown): ParticipationViewModel => {
  const item = asRecord(input);
  const event = asRecord(item.event);

  return {
    id: pickString(item.id, pickString(item._id, '')),
    status: pickString(item.status, 'PENDING'),
    paymentStatus: pickString(item.paymentStatus, 'UNPAID'),
    eventTitle: pickString(
      event.title,
      pickString(item.eventTitle, 'Untitled event'),
    ),
    eventId: pickString(event.id, pickString(item.eventId, '')),
    eventStatus: pickString(event.status, 'ACTIVE'),
    registrationFee: pickNumber(
      event.registrationFee,
      pickNumber(item.registrationFee, 0),
    ),
    createdAt: pickString(item.createdAt, ''),
  };
};
