'use server';

import { revalidatePath } from 'next/cache';
import { serverHttpClient } from '@/lib/axios/serverHttpClient';

export type DashboardActionResult = {
  success: boolean;
  message: string;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (!error || typeof error !== 'object') {
    return fallback;
  }

  const errorRecord = error as {
    response?: {
      data?: {
        message?: string;
        errorSources?: Array<{
          message?: string;
        }>;
      };
    };
  };

  return (
    errorRecord.response?.data?.errorSources?.[0]?.message ||
    errorRecord.response?.data?.message ||
    fallback
  );
};

export const respondInvitationAction = async (
  invitationId: string,
  action: 'accept' | 'reject',
): Promise<DashboardActionResult> => {
  try {
    await serverHttpClient.patch(`/invitations/${invitationId}/${action}`, {});

    revalidatePath('/dashboard/invitations');
    revalidatePath('/dashboard/pending-invitations');

    return {
      success: true,
      message:
        action === 'accept'
          ? 'Invitation accepted successfully.'
          : 'Invitation rejected successfully.',
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, `Failed to ${action} invitation.`),
    };
  }
};

export const updateMyReviewAction = async (
  reviewId: string,
  payload: { rating?: number; review?: string },
): Promise<DashboardActionResult> => {
  const rating = payload.rating;
  const review = payload.review?.trim() || undefined;

  if (
    rating !== undefined &&
    (!Number.isInteger(rating) || rating < 1 || rating > 5)
  ) {
    return {
      success: false,
      message: 'Rating must be an integer between 1 and 5.',
    };
  }

  if (!review && rating === undefined) {
    return {
      success: false,
      message: 'Provide at least one field to update.',
    };
  }

  try {
    await serverHttpClient.patch(`/reviews/${reviewId}`, {
      ...(rating !== undefined ? { rating } : {}),
      ...(review !== undefined ? { review } : {}),
    });

    revalidatePath('/dashboard/my-reviews');

    return {
      success: true,
      message: 'Review updated successfully.',
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, 'Failed to update review.'),
    };
  }
};

export const createMyReviewAction = async (
  eventId: string,
  payload: { rating: number; review?: string },
): Promise<DashboardActionResult> => {
  const rating = payload.rating;
  const review = payload.review?.trim() || undefined;

  if (!eventId) {
    return {
      success: false,
      message: 'Event id is required.',
    };
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return {
      success: false,
      message: 'Rating must be an integer between 1 and 5.',
    };
  }

  try {
    await serverHttpClient.post(`/reviews/events/${eventId}`, {
      rating,
      ...(review !== undefined ? { review } : {}),
    });

    revalidatePath('/dashboard/my-reviews');
    revalidatePath(`/events/${eventId}`);

    return {
      success: true,
      message: 'Review created successfully.',
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, 'Failed to create review.'),
    };
  }
};

export const deleteMyReviewAction = async (
  reviewId: string,
): Promise<DashboardActionResult> => {
  try {
    await serverHttpClient.delete(`/reviews/${reviewId}`);

    revalidatePath('/dashboard/my-reviews');

    return {
      success: true,
      message: 'Review deleted successfully.',
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, 'Failed to delete review.'),
    };
  }
};
