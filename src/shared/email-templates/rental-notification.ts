export interface RentalNotificationData {
  recipientName: string;
  rentalAmount: number;
  dueDate: string;
  propertyAddress?: string;
}

export const rentalNotificationTemplate = (data: RentalNotificationData): string => {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Notificación de Alquiler</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .content {
      background: #f9f9f9;
      padding: 30px;
      border-radius: 0 0 10px 10px;
    }
    .amount {
      font-size: 36px;
      font-weight: bold;
      color: #667eea;
      text-align: center;
      margin: 20px 0;
    }
    .info-box {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      border-left: 4px solid #667eea;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      color: #666;
      font-size: 12px;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background: #667eea;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🏠 Notificación de Alquiler</h1>
  </div>
  
  <div class="content">
    <p>Hola <strong>${data.recipientName}</strong>,</p>
    
    <p>Te recordamos que el próximo pago de alquiler está próximo a vencer.</p>
    
    <div class="amount">
      $${data.rentalAmount.toLocaleString('es-AR')}
    </div>
    
    <div class="info-box">
      <p><strong>📅 Fecha de vencimiento:</strong> ${data.dueDate}</p>
      ${data.propertyAddress ? `<p><strong>🏢 Propiedad:</strong> ${data.propertyAddress}</p>` : ''}
    </div>
    
    <p>Por favor, asegúrate de realizar el pago antes de la fecha indicada para evitar recargos.</p>
    
    <center>
      <a href="#" class="button">Ver detalles</a>
    </center>
  </div>
  
  <div class="footer">
    <p>Este es un correo automático, por favor no responder.</p>
    <p>© ${new Date().getFullYear()} Rental Manager</p>
  </div>
</body>
</html>
  `.trim();
};
