import { post, get } from './api';
import type { User } from '../types';

interface RegisterData {
  email: string;
  username: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
}

export async function register(data: RegisterData) {
  return post<AuthResponse>('/auth/register', data);
}

export async function login(data: LoginData) {
  return post<AuthResponse>('/auth/login', data);
}

export async function logout() {
  return post<{ message: string }>('/auth/logout');
}

export async function me() {
  return get<AuthResponse>('/auth/me');
}
