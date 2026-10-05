/**
 * Centralized API Client configuration for LexAI India Frontend.
 * Standardizes base URL resolution and error handling across all feature services.
 */

export const API_BASE_URL: string = (
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001'
).replace(/\/+$/, '');

export interface ApiErrorDetail {
  msg?: string;
  loc?: string[];
}

export interface ApiErrorResponse {
  detail?: string | ApiErrorDetail[];
}

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

/**
 * Standardized API response error extractor.
 */
export async function parseApiError(response: Response): Promise<string> {
  try {
    const errorData: ApiErrorResponse = await response.json();
    if (typeof errorData.detail === 'string') {
      return errorData.detail;
    }
    if (Array.isArray(errorData.detail) && errorData.detail.length > 0) {
      return errorData.detail.map((e) => e.msg || 'Validation error').join(', ');
    }
  } catch {
    // Non-JSON error payload
  }
  return `Request failed with status ${response.status}: ${response.statusText}`;
}

/**
 * Common headers for JSON HTTP requests.
 */
export function getJsonHeaders(token?: string | null): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}
