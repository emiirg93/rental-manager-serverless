import { createErrorResponse, createResponse } from '@shared';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';

interface SendEmailRequest {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  try {
    if (!event.body) {
      return createErrorResponse(400, 'Body es requerido');
    }

    const body: SendEmailRequest = JSON.parse(event.body);
    
    // Validaciones
    if (!body.to || !body.subject || (!body.text && !body.html)) {
      return createErrorResponse(
        400, 
        'Faltan campos requeridos',
        'Los campos "to", "subject" y al menos "text" o "html" son obligatorios'
      );
    }

    const ses = new AWS.SES({ 
      apiVersion: '2010-12-01',
      region: process.env.REGION || 'us-east-1' 
    });

    const params: AWS.SES.SendEmailRequest = {
      Source: process.env.EMAIL_FROM || 'noreply@tudominio.com',
      Destination: {
        ToAddresses: [body.to]
      },
      Message: {
        Subject: {
          Data: body.subject,
          Charset: 'UTF-8'
        },
        Body: {
          Text: body.text ? {
            Data: body.text,
            Charset: 'UTF-8'
          } : undefined,
          Html: body.html ? {
            Data: body.html,
            Charset: 'UTF-8'
          } : undefined
        }
      }
    };

    const result = await ses.sendEmail(params).promise();

    console.log('Email enviado:', result.MessageId);

    return createResponse(200, {
      messageId: result.MessageId,
    }, 'Email enviado exitosamente');

  } catch (error) {
    console.error('Error:', error);
    return createErrorResponse(
      500,
      'Error al enviar el email',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};
