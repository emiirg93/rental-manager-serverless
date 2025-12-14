import { createErrorResponse, createResponse } from '@shared';
import { paymentConfirmationTemplate, rentalNotificationTemplate } from '@shared/email-templates';
import { parseMultipartFormData } from '@shared/utils';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as nodemailer from 'nodemailer';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  try {
    // Parsear form-data
    const { fields, files } = await parseMultipartFormData(event);
    
    // Validaciones
    if (!fields.to || !fields.subject) {
      return createErrorResponse(
        400, 
        'Faltan campos requeridos',
        'Los campos "to" y "subject" son obligatorios'
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

    // Generar HTML según el template solicitado
    let html = fields.html || '';
    
    // Si se especifica un template, usarlo
    if (fields.template) {
      const templateData = fields.templateData ? JSON.parse(fields.templateData) : {};
      
      switch (fields.template) {
        case 'rental-notification':
          html = rentalNotificationTemplate(templateData);
          break;
        case 'payment-confirmation':
          html = paymentConfirmationTemplate(templateData);
          break;
        default:
          return createErrorResponse(400, 'Template no válido');
      }
    }

    // Validar que haya contenido
    if (!html && !fields.text) {
      return createErrorResponse(
        400,
        'Falta contenido',
        'Debes especificar "text", "html" o "template"'
      );
    }

    // Enviar el email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: fields.to,
      subject: fields.subject,
      text: fields.text,
      html: html,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    console.log('Email enviado:', info.messageId);

    return createResponse(200, {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      attachmentsCount: attachments.length,
      template: fields.template || 'custom',
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
