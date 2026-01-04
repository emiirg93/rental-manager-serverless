interface Expensas {
  ordinarias?: number;
  extraordinarias: number;
  total1erVencimiento?: number;
  fechaVencimiento?: string;
}

interface Arreglos {
  descripcion: string;
  costoTotal: number;
  cantidadCuotas: string;
  cuotaActual: string;
  costoPorMes: number;
}

export interface RentalSummaryData {
  expensas: Expensas;
  arreglos?: Arreglos;
  alquilerBruto:number;
  alquilerNeto: number;
  comentario?: string;
}

const formatToARS = (amount: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(amount);
};

const monthName = (): string => {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return months[new Date().getMonth()];
};

export const rentalSummaryTemplate = (data: RentalSummaryData): string => {
    console.log('Generating rental summary with data:', data);
    return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="es">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Resumen de Alquiler</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
    
    <!-- Container Principal -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="padding: 40px 20px;">
        <tr>
            <td align="center">
                
                <!-- Card Principal -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 650px; background-color: #ffffff; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ffffff; font-size: 32px; font-weight: 700; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                📋 Resumen de Alquiler
                            </h1>
                            <p style="color: #f0f0f0; font-size: 18px; margin: 10px 0 0 0; font-weight: 300;">
                                ${monthName()} ${new Date().getFullYear()}
                            </p>
                        </td>
                    </tr>

                    <!-- Contenido -->
                    <tr>
                        <td style="padding: 35px 30px;">

                            <!-- Alquiler Bruto -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 25px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px; overflow: hidden;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td style="vertical-align: middle;">
                                                    <div style="background-color: rgba(255,255,255,0.2); width: 50px; height: 50px; border-radius: 12px; display: inline-block; text-align: center; line-height: 50px; font-size: 24px;">
                                                        🏠
                                                    </div>
                                                </td>
                                                <td style="padding-left: 15px; vertical-align: middle;">
                                                    <p style="margin: 0; color: rgba(255,255,255,0.9); font-size: 14px; font-weight: 500;">Alquiler Bruto</p>
                                                    <p style="margin: 5px 0 0 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                                                        ${formatToARS(data.alquilerBruto)}
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Expensas -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 25px; background-color: #f8f9fa; border-radius: 15px; border: 2px solid #e9ecef;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td colspan="2" style="padding-bottom: 20px;">
                                                    <table border="0" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td style="vertical-align: middle;">
                                                                <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); width: 40px; height: 40px; border-radius: 10px; display: inline-block; text-align: center; line-height: 40px; font-size: 20px;">
                                                                    💰
                                                                </div>
                                                            </td>
                                                            <td style="padding-left: 12px; vertical-align: middle;">
                                                                <h2 style="margin: 0; color: #2d3748; font-size: 20px; font-weight: 600;">Expensas</h2>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            ${data.expensas.ordinarias ? `
                                            <tr>
                                                <td style="padding: 8px 0; color: #718096; font-size: 15px;">Ordinarias</td>
                                                <td align="right" style="padding: 8px 0; color: #2d3748; font-size: 15px; font-weight: 600;">
                                                    ${formatToARS(data.expensas.ordinarias)}
                                                </td>
                                            </tr>
                                            ` : ''}
                                            <tr>
                                                <td style="padding: 8px 0; color: #718096; font-size: 15px;">Extraordinarias</td>
                                                <td align="right" style="padding: 8px 0; color: #2d3748; font-size: 15px; font-weight: 600;">
                                                    ${formatToARS(data.expensas.extraordinarias)}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" style="padding: 12px 0;">
                                                    <div style="height: 2px; background: linear-gradient(to right, #f093fb, #f5576c); border-radius: 2px;"></div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; color: #2d3748; font-size: 16px; font-weight: 600;">Total Expensas</td>
                                                <td align="right" style="padding: 8px 0; color: #f5576c; font-size: 20px; font-weight: 700;">
                                                    ${formatToARS(data.expensas.total1erVencimiento || data.expensas.extraordinarias)}
                                                </td>
                                            </tr>
                                            ${data.expensas.fechaVencimiento ? `
                                            <tr>
                                                <td colspan="2" style="padding-top: 12px;">
                                                    <div style="background-color: #fff5f5; border-left: 4px solid #f5576c; padding: 12px 15px; border-radius: 8px;">
                                                        <p style="margin: 0; color: #c53030; font-size: 13px; font-weight: 500;">
                                                            📅 Vencimiento: ${data.expensas.fechaVencimiento}
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                            ` : ''}
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Arreglos -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 25px; background-color: #f8f9fa; border-radius: 15px; border: 2px solid #e9ecef;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td colspan="2" style="padding-bottom: ${data.arreglos ? '20px' : '0'};">
                                                    <table border="0" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td style="vertical-align: middle;">
                                                                <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); width: 40px; height: 40px; border-radius: 10px; display: inline-block; text-align: center; line-height: 40px; font-size: 20px;">
                                                                    🔧
                                                                </div>
                                                            </td>
                                                            <td style="padding-left: 12px; vertical-align: middle;">
                                                                <h2 style="margin: 0; color: #2d3748; font-size: 20px; font-weight: 600;">Arreglos</h2>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            ${data.arreglos ? `
                                            <tr>
                                                <td colspan="2" style="padding: 12px 0 8px 0;">
                                                    <div style="background-color: #e6f7ff; border-left: 4px solid #00f2fe; padding: 12px 15px; border-radius: 8px; margin-bottom: 15px;">
                                                        <p style="margin: 0; color: #0c4a6e; font-size: 14px; font-weight: 500;">
                                                            ${data.arreglos.descripcion}
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; color: #718096; font-size: 15px;">Cuota Actual</td>
                                                <td align="right" style="padding: 8px 0; color: #2d3748; font-size: 15px; font-weight: 600;">
                                                    ${data.arreglos.cuotaActual} / ${data.arreglos.cantidadCuotas}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; color: #718096; font-size: 15px;">Valor a Descontar</td>
                                                <td align="right" style="padding: 8px 0; color: #2d3748; font-size: 15px; font-weight: 600;">
                                                    ${formatToARS(data.arreglos.costoPorMes)}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" style="padding: 12px 0;">
                                                    <div style="height: 2px; background: linear-gradient(to right, #4facfe, #00f2fe); border-radius: 2px;"></div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; color: #2d3748; font-size: 16px; font-weight: 600;">Costo Total del Arreglo</td>
                                                <td align="right" style="padding: 8px 0; color: #00f2fe; font-size: 20px; font-weight: 700;">
                                                    ${formatToARS(data.arreglos.costoTotal)}
                                                </td>
                                            </tr>
                                            ` : `
                                            <tr>
                                                <td colspan="2" style="padding-top: 15px; text-align: center;">
                                                    <div style="padding: 30px; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: 12px;">
                                                        <p style="margin: 0; color: #718096; font-size: 16px; font-weight: 600; letter-spacing: 1px;">
                                                            NO APLICA
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                            `}
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Comentarios -->
                            ${data.comentario ? `
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 25px; background-color: #fffbeb; border-radius: 15px; border: 2px solid #fbbf24;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td style="padding-bottom: 15px;">
                                                    <table border="0" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td style="vertical-align: middle;">
                                                                <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); width: 40px; height: 40px; border-radius: 10px; display: inline-block; text-align: center; line-height: 40px; font-size: 20px;">
                                                                    💬
                                                                </div>
                                                            </td>
                                                            <td style="padding-left: 12px; vertical-align: middle;">
                                                                <h2 style="margin: 0; color: #92400e; font-size: 20px; font-weight: 600;">Comentarios</h2>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <p style="margin: 0; color: #78350f; font-size: 15px; line-height: 1.6; font-weight: 400;">
                                                        ${data.comentario}
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            ` : ''}

                            <!-- Total a Pagar -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); border-radius: 15px; box-shadow: 0 10px 30px rgba(17, 153, 142, 0.3);">
                                <tr>
                                    <td style="padding: 30px; text-align: center;">
                                        <p style="margin: 0 0 12px 0; color: rgba(255,255,255,0.95); font-size: 18px; font-weight: 500; letter-spacing: 1px;">
                                            💵 TOTAL A PAGAR
                                        </p>
                                        <p style="margin: 0; color: #ffffff; font-size: 42px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                            ${formatToARS(data.alquilerNeto)}
                                        </p>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="margin: 0 0 8px 0; color: #718096; font-size: 14px; font-style: italic;">
                                Gracias por todo. Cualquier consulta, estamos en contacto.
                            </p>
                            <p style="margin: 0; color: #2d3748; font-size: 16px; font-weight: 600;">
                                Emiliano Rago - Colpayo 616 6B
                            </p>
                            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e9ecef;">
                                <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                                    Este es un mensaje automático, por favor no responder directamente.
                                </p>
                            </div>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>
  `.trim();
};
