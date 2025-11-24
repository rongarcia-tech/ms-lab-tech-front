export interface AuthLoginRequest {
  username: string;
  password: string;
}

export interface AuthLoginResponse {
  token: string;
  expiresAt: string;   // Instant en backend → string ISO en frontend
  userId: string;
  username: string;
  roles: string[];
  labCode?: string | null;
}
