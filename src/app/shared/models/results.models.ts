export type ResultStatus = 'PENDING' | 'FINAL' | 'CANCELLED';

export interface LabResultResponse {
  id: number;
  externalId: string;

  // vínculo con la orden / paciente
  orderExternalId: string;
  patientId: string;

  // datos del examen (flexible)
  testCode: string;
  testName: string;

  // valor (si es numérico o texto)
  valueText: string | null;
  valueNumber: number | null;
  unit: string | null;
  referenceRange: string | null;
  flag: 'NORMAL' | 'HIGH' | 'LOW' | null;

  status: ResultStatus;

  createdAt: string;
  updatedAt: string;
}
