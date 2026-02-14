export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';

export interface User {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: Gender;
  loyaltyPoints: number;
  isEmailVerified: boolean;
  role: string;
  avatarUrl?: string;
  createdAt: Date;
}

/**
 * Helper to get display name from user object
 */
export function getUserFullName(user: User | null | undefined): string {
  if (!user) return '';
  const parts = [user.firstName, user.middleName, user.lastName].filter(Boolean);
  return parts.join(' ').trim();
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: Gender;
}

export interface AuthResponse {
  token: string | null;  // No longer provided - stored in HttpOnly cookie
  type: string | null;   // No longer provided
  id: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  loyaltyPoints: number;
  isEmailVerified: boolean;
  role: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  timestamp: string;
}
