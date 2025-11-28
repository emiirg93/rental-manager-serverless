import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { RentalValue, UpdateRentalValueRequest } from '../shared/types';
import { createErrorResponse, createResponse } from '../shared/utils';

const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME!;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  try {
    if (!event.body) {
      return createErrorResponse(400, 'Body de la request es requerido');
    }
    
    const body: UpdateRentalValueRequest = JSON.parse(event.body);
    
    if (body.amount === undefined || body.amount === null) {
      return createErrorResponse(400, 'El campo "amount" es requerido');
    }
    
    if (typeof body.amount !== 'number' || body.amount < 0) {
      return createErrorResponse(400, 'El amount debe ser un número positivo');
    }
    
    const rentalValue: RentalValue = {
      id: 'current',
      amount: body.amount,
      currency: body.currency || 'ARS',
      updatedAt: new Date().toISOString(),
      description: body.description || 'Valor de alquiler mensual'
    };
    
    await dynamodb.put({
      TableName: TABLE_NAME,
      Item: rentalValue,
    }).promise();
    
    return createResponse(200, rentalValue, 'Valor de alquiler actualizado exitosamente');
    
  } catch (error) {
    console.error('Error:', error);
    return createErrorResponse(
      500,
      'Error interno del servidor',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};