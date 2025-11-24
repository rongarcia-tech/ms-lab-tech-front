import { UserResponse } from '../models/user.models';

export const MOCK_CURRENT_USER: UserResponse = {
  id: 1,
  externalId: '11111111-1111-1111-1111-111111111111',
  username: 'lab_admin',
  email: 'lab.admin@example.com',
  roles: ['ROLE_ADMIN', 'ROLE_LAB_MANAGER'],
  labCode: 'LAB_SANTIAGO',
  active: true,
  createdAt: '2025-01-01T10:00:00',
  updatedAt: '2025-01-10T15:30:00',
};
