export interface RentalValue {
  id: string;
  amount: number;
  currency?: string;
  updatedAt?: string;
  description?: string;
}

export interface UpdateRentalValueRequest {
  amount: number;
  currency?: string;
  description?: string;
}

export interface ApiResponse<T = any> {
  statusCode: number;
  headers: {
    'Content-Type': string;
    'Access-Control-Allow-Origin': string;
  };
  body: string;
}