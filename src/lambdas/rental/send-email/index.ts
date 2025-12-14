import { createErrorResponse, createResponse } from '@shared';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as nodemailer from 'nodemailer';

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

    // Configurar transporter de nodemailer con Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Enviar el email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: body.to,
      subject: body.subject,
      text: body.text,
      html: body.html,
    });

    console.log('Email enviado:', info.messageId);

    return createResponse(200, {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
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
