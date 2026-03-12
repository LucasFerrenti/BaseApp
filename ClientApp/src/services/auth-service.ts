import { authApi } from '@/api/auth-api';
import type { LoginCredentials, UserBasic, LoginResult } from '@/types/user';
import { apiClient } from '@/api/api-client';
import { storageService } from '@/services/storage-service';
import { AuthContextType } from '@/context/auth-context';
import type { ApiResult } from '@/types/api';

const STORAGE_KEY_TOKEN = 'auth_token';
const STORAGE_KEY_USER = 'auth_user';

let context: AuthContextType | null = null;

export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResult<LoginResult>> {
    const result = await authApi.login(credentials);

    if (result.success) {
      const { token, user } = result.data;
      apiClient.setToken(token);
      await storageService.set(STORAGE_KEY_TOKEN, token);
      await storageService.set(STORAGE_KEY_USER, user);
    }
    return result;
  },

  async logout() {
    apiClient.setToken(null);
    await storageService.remove(STORAGE_KEY_TOKEN);
    await storageService.remove(STORAGE_KEY_USER);
  },

  async restoreSession(): Promise<{ token: string; user: UserBasic } | null> {
    const token = await storageService.get<string>(STORAGE_KEY_TOKEN);
    const user = await storageService.get<UserBasic>(STORAGE_KEY_USER);
    if (token && user) {
      apiClient.setToken(token);
      return { token, user };
    }
    return null;
  },

  async resendConfirmation(email: string): Promise<ApiResult<null>> {
    return authApi.resendConfirmation(email);
  },

  async confirmAccount(token: string): Promise<ApiResult<null>> {
    return authApi.confirmAccount(token);
  },

  async forgotPassword(email: string): Promise<ApiResult<null>> {
    return authApi.forgotPassword(email);
  },

  async resetPassword(token: string, newPassword: string): Promise<ApiResult<null>> {
    return authApi.resetPassword(token, newPassword);
  }
};
