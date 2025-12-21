export interface CreateLabResultRequest {
  orderExternalId: string;
  patientId: string;
  labCode: string;
  requestedTest: string;
  testName: string;

  valueText?: string | null;
  valueNumber?: number | null;
  unit?: string | null;
  referenceRange?: string | null;
  flag?: 'NORMAL' | 'HIGH' | 'LOW' | null;

  status?: 'PENDING' | 'FINAL' | 'CANCELLED';
}

export interface UpdateLabResultRequest {
  testCode?: string;
  requestedTest?: string;

  valueText?: string | null;
  valueNumber?: number | null;
  unit?: string | null;
  referenceRange?: string | null;
  flag?: 'NORMAL' | 'HIGH' | 'LOW' | null;

  status?: 'PENDING' | 'FINAL' | 'CANCELLED';
}
