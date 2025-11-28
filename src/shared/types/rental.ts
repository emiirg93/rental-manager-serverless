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