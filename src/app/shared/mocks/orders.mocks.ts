import { OrderResponse } from '../models/orders.models';

export const MOCK_ORDERS: OrderResponse[] = [
  {
    id: 100,
    externalId: 'ord-2025-0001',
    patientId: 'RUT-11.111.111-1',
    requestedTest: 'HEMOGRAMA',
    status: 'ASSIGNED',
    lab: {
      id: 1,
      code: 'LAB_SANTIAGO',
      name: 'Laboratorio Central Santiago',
    },
    assignedAt: '2025-02-01T09:30:00',
    createdAt: '2025-02-01T09:00:00',
    updatedAt: '2025-02-01T09:35:00',
  },
  {
    id: 101,
    externalId: 'ord-2025-0002',
    patientId: 'RUT-22.222.222-2',
    requestedTest: 'PCR_COVID',
    status: 'PENDING',
    lab: null,
    assignedAt: null,
    createdAt: '2025-02-02T11:15:00',
    updatedAt: '2025-02-02T11:15:00',
  },
];
