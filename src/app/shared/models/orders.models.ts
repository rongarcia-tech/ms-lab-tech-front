export type OrderStatus =
  | 'PENDING'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface OrderLabMini {
  id: number;
  code: string;
  name: string;
}

export interface OrderResponse {
  id: number;
  externalId: string;
  patientId: string;
  requestedTest: string;
  status: OrderStatus;
  lab: OrderLabMini | null;
  assignedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
