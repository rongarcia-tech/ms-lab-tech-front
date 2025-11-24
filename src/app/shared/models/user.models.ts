export interface UserResponse {
  id: number;
  externalId: string;
  username: string;
  email: string;
  roles: string[];
  labCode: string | null;
  active: boolean;
  createdAt: string;   // LocalDateTime → string
  updatedAt: string;   // LocalDateTime → string
}
