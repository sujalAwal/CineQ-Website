export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';

export interface User {
  id: string;
  firstName: string;
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
  return `${user.firstName} ${user.lastName}`.trim();
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: Gender;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  loyaltyPoints: number;
  isEmailVerified: boolean;
  role: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}
