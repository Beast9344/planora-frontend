/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { serverHttpClient } from '@/lib/axios/serverHttpClient';

export type ActionResult<T = unknown> =
  | { success: true; message: string; data?: T }
  | { success: false; message: string };

export const initiateEventPaymentAction = async (
  eventId: string,
): Promise<ActionResult<{ paymentUrl?: string }>> => {
  try {
    const response = await serverHttpClient.post<{
      paymentUrl?: string;
    }>('/payments/initiate', { eventId });

    return {
      success: true,
      message: 'Payment session created',
      data: {
        paymentUrl: (response.data as any)?.paymentUrl,
      },
    };
  } catch (error: any) {
    const message =
      error?.response?.data?.message || 'Payment initiation failed';
    return { success: false, message };
  }
};

export const joinEventAction = async (
  eventId: string,
): Promise<ActionResult> => {
  try {
    await serverHttpClient.post(
      '/participations/events/' + eventId + '/join',
      {},
    );

    return {
      success: true,
      message: 'Join request sent',
    };
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Join failed';
    return { success: false, message };
  }
};
