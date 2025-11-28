import { createErrorResponse, createResponse, RENTAL_RECORD_ID, RENTAL_TABLE_NAME } from '@shared';
import { RentalValue } from '@shared/types';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  try {
    const result = await dynamodb.get({
      TableName: RENTAL_TABLE_NAME,
      Key: { id: RENTAL_RECORD_ID }
    }).promise();
    
    if (!result.Item) {
      const defaultValue: RentalValue = {
        id: RENTAL_RECORD_ID,
        amount: 0,
      };
      
      return createResponse(200, defaultValue, 'Valor de alquiler no configurado aún');
    }
    
    return createResponse(200, result.Item as RentalValue);
    
  } catch (error) {
    console.error('Error:', error);
    return createErrorResponse(
      500,
      'Error interno del servidor',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};