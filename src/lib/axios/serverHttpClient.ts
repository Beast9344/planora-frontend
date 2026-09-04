/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';

import axios from 'axios';
import { cookies, headers } from 'next/headers';
import { getNewTokensWithRefreshToken } from '@/services/auth.services';
import { ApiResponse } from '@/types/api.types';
import { isTokenExpiringSoon } from '../tokenUtils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('API_BASE_URL is not defined in environment variables');
}

async function tryRefreshToken(
  accessToken: string,
  refreshToken: string,
): Promise<void> {
  if (!isTokenExpiringSoon(accessToken)) {
    return;
  }

  const requestHeader = await headers();

  if (requestHeader.get('x-token-refreshed') === '1') {
    return;
  }

  try {
    await getNewTokensWithRefreshToken(refreshToken);
  } catch (error: any) {
    console.error('Error refreshing token in server http client:', error);
  }
}

const axiosInstance = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (accessToken && refreshToken) {
    await tryRefreshToken(accessToken, refreshToken);
  }

  const cookieHeader = cookieStore
    .getAll()
    .map(cookie => `${cookie.name}=${cookie.value}`)
    .join('; ');

  return axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
  });
};

export interface ApiRequestOptions {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

const httpGet = async <TData>(
  endpoint: string,
  options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
  const instance = await axiosInstance();
  const response = await instance.get<ApiResponse<TData>>(endpoint, {
    params: options?.params,
    headers: options?.headers,
  });

  return response.data;
};

const httpPost = async <TData>(
  endpoint: string,
  data: unknown,
  options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
  const instance = await axiosInstance();
  const response = await instance.post<ApiResponse<TData>>(endpoint, data, {
    params: options?.params,
    headers: options?.headers,
  });

  return response.data;
};

const httpPut = async <TData>(
  endpoint: string,
  data: unknown,
  options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
  const instance = await axiosInstance();
  const response = await instance.put<ApiResponse<TData>>(endpoint, data, {
    params: options?.params,
    headers: options?.headers,
  });

  return response.data;
};

const httpPatch = async <TData>(
  endpoint: string,
  data: unknown,
  options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
  const instance = await axiosInstance();
  const response = await instance.patch<ApiResponse<TData>>(endpoint, data, {
    params: options?.params,
    headers: options?.headers,
  });

  return response.data;
};

const httpDelete = async <TData>(
  endpoint: string,
  options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
  const instance = await axiosInstance();
  const response = await instance.delete<ApiResponse<TData>>(endpoint, {
    params: options?.params,
    headers: options?.headers,
  });

  return response.data;
};

export const serverHttpClient = {
  get: httpGet,
  post: httpPost,
  put: httpPut,
  patch: httpPatch,
  delete: httpDelete,
};
