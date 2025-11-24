import { UserResponse } from '../models/user.models';

export interface MockAuthUser {
  username: string;
  password: string;
  user: UserResponse;
}

// Tres usuarios de ejemplo con roles distintos
export const MOCK_AUTH_USERS: MockAuthUser[] = [
  {
    username: 'admin',
    password: 'admin123',
    user: {
      id: 1,
      externalId: '11111111-1111-1111-1111-111111111111',
      username: 'admin',
      email: 'admin@example.com',
      roles: ['ROLE_ADMIN', 'ROLE_LAB_MANAGER'],
      labCode: 'LAB_SANTIAGO',
      active: true,
      createdAt: '2025-01-01T10:00:00',
      updatedAt: '2025-01-10T15:30:00',
    },
  },
  {
    username: 'tech',
    password: 'tech123',
    user: {
      id: 2,
      externalId: '22222222-2222-2222-2222-222222222222',
      username: 'tech',
      email: 'tech@example.com',
      roles: ['ROLE_LAB_TECHNICIAN'],
      labCode: 'LAB_VALPARAISO',
      active: true,
      createdAt: '2025-02-01T09:00:00',
      updatedAt: '2025-02-05T11:45:00',
    },
  },
  {
    username: 'viewer',
    password: 'viewer123',
    user: {
      id: 3,
      externalId: '33333333-3333-3333-3333-333333333333',
      username: 'viewer',
      email: 'viewer@example.com',
      roles: ['ROLE_VIEWER'],
      labCode: null,
      active: true,
      createdAt: '2025-03-01T08:30:00',
      updatedAt: '2025-03-02T14:20:00',
    },
  },
];
