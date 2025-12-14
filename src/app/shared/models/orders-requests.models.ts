export interface CreateOrderRequest {
  patientId: string;
  requestedTest: string;
  labCode?: string; // optional
}

export interface AssignLabRequest {
  labCode: string;
}
