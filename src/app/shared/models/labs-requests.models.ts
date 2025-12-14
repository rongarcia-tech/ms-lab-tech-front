export interface CreateLabRequest {
  code: string;
  name: string;
  address: string;
  phone: string;
  supportedTests: string[];
}

export interface UpdateLabRequest {
  name: string;
  address: string;
  phone: string;
}
