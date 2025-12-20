export interface CreateLabResultRequest {
  orderExternalId: string;
  patientId: string;

  testCode: string;
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
  testName?: string;

  valueText?: string | null;
  valueNumber?: number | null;
  unit?: string | null;
  referenceRange?: string | null;
  flag?: 'NORMAL' | 'HIGH' | 'LOW' | null;

  status?: 'PENDING' | 'FINAL' | 'CANCELLED';
}
