import { LoginCredentials, LoginResult } from "@/types/user";
import { ApiResult } from "@/types/api";
import { apiClient } from "./api-client";
import type { UserRegisterPayload } from "@/types/user";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<ApiResult<LoginResult>> => {
    const result = await apiClient.post<LoginResult>('/auth/login', credentials);
    return result;
  },

  register: async (payload: UserRegisterPayload): Promise<ApiResult<null>> => {
    const result = await apiClient.post<null>('/auth/register', payload);
    return result;
  },

  resendConfirmation: async (email: string): Promise<ApiResult<null>> => {
    const result = await apiClient.post<null>('/auth/resend', { email });
    return result;
  },

  confirmAccount: async (token: string): Promise<ApiResult<null>> => {
    const result = await apiClient.get<null>(`/auth/confirm?token=${encodeURIComponent(token)}`);
    return result;
  },

  forgotPassword: async (email: string): Promise<ApiResult<null>> => {
    const result = await apiClient.post<null>('/auth/forgot-password', { email });
    return result;
  },

  resetPassword: async (token: string, newPassword: string): Promise<ApiResult<null>> => {
    const result = await apiClient.post<null>('/auth/reset-password', { token, newPassword });
    return result;
  },
};