export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  labCode: string | null;
  roles: string[];      // e.g. ["LAB_TECH"]
  active: boolean;
}

export interface UpdateUserRequest {
  email: string;
  labCode: string | null;
  roles: string[];
  active: boolean;
}
