import { API_BASE_URL } from '@/constants/api';
import type { ApiResult } from '@/types/api';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async get<T>(endpoint: string): Promise<ApiResult<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return response.json();
    } catch (error) {
      console.error(error);
      return { 
        success: false,
        message: 'Error al obtener los datos',
        data: {} as T,
        errors: [error as string] 
      };
    }
  }

  async post<T>(endpoint: string, body?: unknown): Promise<ApiResult<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: body ? JSON.stringify(body) : undefined,
      });

      return response.json();
    } catch (error) {
      console.error(error);
      return { 
        success: false,
        message: 'Error al obtener los datos',
        data: {} as T,
        errors: [error as string] 
      };
    }
  }

  async put<T>(endpoint: string, body?: unknown): Promise<ApiResult<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: body ? JSON.stringify(body) : undefined,
      });

      return response.json();
    } catch (error) {
      console.error(error);
      return { 
        success: false,
        message: 'Error al obtener los datos',
        data: {} as T,
        errors: [error as string] 
      };
    }
  }

  async delete<T>(endpoint: string): Promise<ApiResult<T>> {
    try { 
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      return response.json();
    } catch (error) {
      console.error(error);
      return { 
        success: false,
        message: 'Error al obtener los datos',
        data: {} as T,
        errors: [error as string] 
      };
    }
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
