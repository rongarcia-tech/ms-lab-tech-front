export interface LabResponse {
  id: number;
  externalId: string;
  code: string;
  name: string;
  address: string;
  phone: string;
  active: boolean;
  supportedTests: string[];
  createdAt: string;
  updatedAt: string;
}
