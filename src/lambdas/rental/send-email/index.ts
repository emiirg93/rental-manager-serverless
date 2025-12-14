import { createErrorResponse, createResponse } from '@shared';
import { parseMultipartFormData } from '@shared/utils';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as nodemailer from 'nodemailer';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  try {
    // Parsear form-data
    const { fields, files } = await parseMultipartFormData(event);
    
    // Validaciones
    if (!fields.to || !fields.subject || (!fields.text && !fields.html)) {
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

    // Preparar attachments desde los archivos del form-data
    const attachments = files.map(file => ({
      filename: file.filename,
      content: file.buffer,
    }));

    // Enviar el email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: fields.to,
      subject: fields.subject,
      text: fields.text,
      html: fields.html,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    console.log('Email enviado:', info.messageId);

    return createResponse(200, {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      attachmentsCount: attachments.length,
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
