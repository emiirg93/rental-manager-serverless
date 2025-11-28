import { UpdateRentalValueRequest } from '../types/rental';

export const validateRentalRequest = (body: any): body is UpdateRentalValueRequest => {
  if (body.amount === undefined || body.amount === null) {
    throw new Error('El campo "amount" es requerido');
  }
  
  if (typeof body.amount !== 'number' || body.amount < 0) {
    throw new Error('El amount debe ser un número positivo');
  }
  
  return true;
};