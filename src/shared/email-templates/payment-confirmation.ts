export interface PaymentConfirmationData {
  recipientName: string;
  amount: number;
  paymentDate: string;
  receiptNumber: string;
  propertyAddress?: string;
}

export const paymentConfirmationTemplate = (data: PaymentConfirmationData): string => {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Pago</title>
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
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .success-icon {
      font-size: 48px;
      margin-bottom: 10px;
    }
    .content {
      background: #f9f9f9;
      padding: 30px;
      border-radius: 0 0 10px 10px;
    }
    .receipt-box {
      background: white;
      padding: 25px;
      border-radius: 8px;
      margin: 20px 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .receipt-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
    }
    .receipt-row:last-child {
      border-bottom: none;
      font-weight: bold;
      font-size: 18px;
      color: #11998e;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      color: #666;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="success-icon">✅</div>
    <h1>¡Pago Confirmado!</h1>
  </div>
  
  <div class="content">
    <p>Hola <strong>${data.recipientName}</strong>,</p>
    
    <p>Hemos recibido tu pago exitosamente. A continuación los detalles:</p>
    
    <div class="receipt-box">
      <div class="receipt-row">
        <span>Número de recibo:</span>
        <span><strong>${data.receiptNumber}</strong></span>
      </div>
      <div class="receipt-row">
        <span>Fecha de pago:</span>
        <span>${data.paymentDate}</span>
      </div>
      ${data.propertyAddress ? `
      <div class="receipt-row">
        <span>Propiedad:</span>
        <span>${data.propertyAddress}</span>
      </div>
      ` : ''}
      <div class="receipt-row">
        <span>Monto pagado:</span>
        <span>$${data.amount.toLocaleString('es-AR')}</span>
      </div>
    </div>
    
    <p>Gracias por tu pago puntual. Si tienes alguna consulta, no dudes en contactarnos.</p>
  </div>
  
  <div class="footer">
    <p>Este es un correo automático, por favor no responder.</p>
    <p>© ${new Date().getFullYear()} Rental Manager</p>
  </div>
</body>
</html>
  `.trim();
};
