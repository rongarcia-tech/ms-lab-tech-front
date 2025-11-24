import { LabResponse } from '../models/labs.models';

export const MOCK_LABS: LabResponse[] = [
  {
    id: 1,
    externalId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    code: 'LAB_SANTIAGO',
    name: 'Laboratorio Central Santiago',
    address: 'Av. Siempre Viva 123, Santiago',
    phone: '+56 2 2345 6789',
    active: true,
    supportedTests: ['HEMOGRAMA', 'PCR_COVID', 'GLUCOSA'],
    createdAt: '2025-01-01T09:00:00',
    updatedAt: '2025-01-15T12:00:00',
  },
  {
    id: 2,
    externalId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    code: 'LAB_VALPARAISO',
    name: 'Laboratorio Valparaíso',
    address: 'Calle del Puerto 456, Valparaíso',
    phone: '+56 32 223 4455',
    active: false,
    supportedTests: ['HEMOGRAMA', 'GLUCOSA'],
    createdAt: '2025-01-05T10:30:00',
    updatedAt: '2025-01-20T16:45:00',
  },
];
