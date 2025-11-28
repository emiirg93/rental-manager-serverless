import {
    createErrorResponse,
    createResponse,
    DEFAULT_CURRENCY,
    DEFAULT_DESCRIPTION,
    RENTAL_RECORD_ID,
    RENTAL_TABLE_NAME,
    validateRentalRequest
} from '@shared';
import { RentalValue, UpdateRentalValueRequest } from '@shared/types';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  try {
    if (!event.body) {
      return createErrorResponse(400, 'Body de la request es requerido');
    }
    
    const body: UpdateRentalValueRequest = JSON.parse(event.body);
    
    // Use validation utility
    validateRentalRequest(body);
    
    const rentalValue: RentalValue = {
      id: RENTAL_RECORD_ID,
      amount: body.amount,
      currency: body.currency || DEFAULT_CURRENCY,
      updatedAt: new Date().toISOString(),
      description: body.description || DEFAULT_DESCRIPTION
    };
    
    await dynamodb.put({
      TableName: RENTAL_TABLE_NAME,
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