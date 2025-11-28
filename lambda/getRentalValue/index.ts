import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { RentalValue } from '../shared/types';
import { createErrorResponse, createResponse } from '../shared/utils';

const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME!;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  try {
    const result = await dynamodb.get({
      TableName: TABLE_NAME,
      Key: { id: 'current' }
    }).promise();
    
    if (!result.Item) {
      const defaultValue: RentalValue = {
        id: 'current',
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