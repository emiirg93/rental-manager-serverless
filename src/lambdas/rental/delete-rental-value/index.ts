import { createErrorResponse, createResponse, RENTAL_RECORD_ID, RENTAL_TABLE_NAME } from '@shared';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  try {
    await dynamodb.delete({
      TableName: RENTAL_TABLE_NAME,
      Key: { id: RENTAL_RECORD_ID },
    }).promise();
    
    return createResponse(200, { deleted: true }, 'Valor de alquiler eliminado exitosamente');
    
  } catch (error) {
    console.error('Error:', error);
    return createErrorResponse(
      500,
      'Error interno del servidor',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};