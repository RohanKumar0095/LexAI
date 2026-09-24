/**
 * LexAI India Authentication API Service
 * Connects frontend authentication flows with the FastAPI + Supabase backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export interface UserResponse {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
}

export interface AuthSuccessResponse {
  access_token: string;
  refresh_token: string | null;
  token_type: string;
  user: UserResponse;
}

export interface AuthErrorResponse {
  detail?: string | Array<{ msg?: string; loc?: string[] }>;
}

export class AuthApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = 'AuthApiError';
    this.statusCode = statusCode;
  }
}

/**
 * Parses API error response body and throws a formatted AuthApiError
 */
async function handleResponseError(response: Response): Promise<never> {
  let errorMessage = 'An unexpected error occurred. Please try again.';
  try {
    const errorData: AuthErrorResponse = await response.json();
    if (typeof errorData.detail === 'string') {
      errorMessage = errorData.detail;
    } else if (Array.isArray(errorData.detail) && errorData.detail.length > 0) {
      errorMessage = errorData.detail.map((e) => e.msg || 'Invalid input').join(', ');
    }
  } catch {
    errorMessage = `Request failed with status ${response.status}: ${response.statusText}`;
  }
  throw new AuthApiError(errorMessage, response.status);
}

/**
 * Register a new user with email and password
 */
export async function signupApi(
  email: string,
  password: string,
  fullName?: string
): Promise<AuthSuccessResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      password,
      full_name: fullName?.trim() || null,
    }),
  });

  if (!response.ok) {
    await handleResponseError(response);
  }

  return response.json();
}

/**
 * Authenticate an existing user with email and password
 */
export async function loginApi(
  email: string,
  password: string
): Promise<AuthSuccessResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      password,
    }),
  });

  if (!response.ok) {
    await handleResponseError(response);
  }

  return response.json();
}

/**
 * Invalidate session on backend
 */
export async function logoutApi(token: string): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Non-fatal on client logout
      console.warn('Backend logout response was not ok:', response.status);
    }
    return response.json();
  } catch (err) {
    console.warn('Backend logout request failed:', err);
    return { message: 'Logged out locally' };
  }
}

/**
 * Fetch current authenticated user profile using active JWT
 */
export async function getMeApi(token: string): Promise<UserResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    await handleResponseError(response);
  }

  return response.json();
}
