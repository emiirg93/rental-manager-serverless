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
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>Resumen de Alquiler</title>
    <style>
        :root {
            color-scheme: light dark;
            supported-color-schemes: light dark;
        }
        
        @media (prefers-color-scheme: dark) {
            .email-body {
                background-color: #1a1a1a !important;
            }
            .card-main {
                background-color: #2d2d2d !important;
                box-shadow: 0 4px 20px rgba(0,0,0,0.4) !important;
            }
            .text-primary {
                color: #e5e5e5 !important;
            }
            .text-secondary {
                color: #b0b0b0 !important;
            }
            .bg-light {
                background-color: #3a3a3a !important;
            }
            .border-light {
                border-color: #4a4a4a !important;
            }
            .footer-bg {
                background-color: #2d2d2d !important;
                border-top-color: #4a4a4a !important;
            }
        }
    </style>
</head>
<body class="email-body" style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #f8f9fa;">
    
    <!-- Container Principal -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="padding: 50px 20px;">
        <tr>
            <td align="center">
                
                <!-- Card Principal -->
                <table class="card-main" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="padding: 45px 40px 35px 40px; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); border-bottom: 3px solid #000000;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="vertical-align: middle;">
                                        <div style="display: inline-block; font-size: 32px; margin-right: 12px;">
                                            📊
                                        </div>
                                    </td>
                                    <td style="vertical-align: middle;">
                                        <h1 style="color: #ffffff; font-size: 26px; font-weight: 600; margin: 0; letter-spacing: -0.5px;">
                                            Resumen de Alquiler
                                        </h1>
                                        <p style="color: #b0b0b0; font-size: 14px; margin: 6px 0 0 0; font-weight: 400;">
                                            ${monthName()} ${new Date().getFullYear()}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Contenido -->
                    <tr>
                        <td style="padding: 40px;">

                            <!-- Alquiler Bruto -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px;">
                                <tr>
                                    <td style="padding: 28px 30px; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); border-radius: 12px; border-left: 4px solid #000000;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td style="vertical-align: middle; width: 45px;">
                                                    <div style="font-size: 28px;">🏠</div>
                                                </td>
                                                <td style="vertical-align: middle;">
                                                    <p style="margin: 0; color: #9b9b9b; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.8px;">
                                                        Alquiler Bruto
                                                    </p>
                                                    <p style="margin: 6px 0 0 0; color: #ffffff; font-size: 32px; font-weight: 600; letter-spacing: -1px;">
                                                        ${formatToARS(data.alquilerBruto)}
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Expensas -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px;">
                                <tr>
                                    <td class="border-light" style="padding: 0 0 18px 0; border-bottom: 3px solid #1a1a1a;">
                                        <table border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="vertical-align: middle; padding-right: 10px;">
                                                    <div style="font-size: 24px;">💰</div>
                                                </td>
                                                <td style="vertical-align: middle;">
                                                    <h2 class="text-primary" style="margin: 0; color: #1a1a1a; font-size: 18px; font-weight: 600; letter-spacing: -0.3px;">
                                                        Expensas
                                                    </h2>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 20px 0 0 0;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            ${data.expensas.ordinarias ? `
                                            <tr>
                                                <td class="text-secondary" style="padding: 10px 0; color: #6b6b6b; font-size: 15px;">Ordinarias</td>
                                                <td class="text-primary" align="right" style="padding: 10px 0; color: #1a1a1a; font-size: 15px; font-weight: 500;">
                                                    ${formatToARS(data.expensas.ordinarias)}
                                                </td>
                                            </tr>
                                            ` : ''}
                                            <tr>
                                                <td class="text-secondary" style="padding: 10px 0; color: #6b6b6b; font-size: 15px;">Extraordinarias</td>
                                                <td class="text-primary" align="right" style="padding: 10px 0; color: #1a1a1a; font-size: 15px; font-weight: 500;">
                                                    ${formatToARS(data.expensas.extraordinarias)}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" style="padding: 16px 0 12px 0;">
                                                    <div class="border-light" style="height: 1px; background-color: #e5e5e5;"></div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-primary" style="padding: 10px 0; color: #1a1a1a; font-size: 16px; font-weight: 600;">Total</td>
                                                <td class="text-primary" align="right" style="padding: 10px 0; color: #1a1a1a; font-size: 18px; font-weight: 600;">
                                                    ${formatToARS(data.expensas.total1erVencimiento || data.expensas.extraordinarias)}
                                                </td>
                                            </tr>
                                            ${data.expensas.fechaVencimiento ? `
                                            <tr>
                                                <td colspan="2" style="padding-top: 20px;">
                                                    <div class="bg-light border-light" style="background-color: #f9f9f9; border-left: 3px solid #1a1a1a; padding: 14px 18px; border-radius: 4px;">
                                                        <p class="text-primary" style="margin: 0; color: #4a4a4a; font-size: 14px; font-weight: 500;">
                                                            Vencimiento: ${data.expensas.fechaVencimiento}
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
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px;">
                                <tr>
                                    <td class="border-light" style="padding: 0 0 18px 0; border-bottom: 3px solid #1a1a1a;">
                                        <table border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="vertical-align: middle; padding-right: 10px;">
                                                    <div style="font-size: 24px;">🔧</div>
                                                </td>
                                                <td style="vertical-align: middle;">
                                                    <h2 class="text-primary" style="margin: 0; color: #1a1a1a; font-size: 18px; font-weight: 600; letter-spacing: -0.3px;">
                                                        Arreglos del Departamento
                                                    </h2>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                ${data.arreglos ? `
                                <tr>
                                    <td style="padding: 20px 0 0 0;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td colspan="2" style="padding: 0 0 18px 0;">
                                                    <div class="bg-light" style="background-color: #f9f9f9; padding: 16px 18px; border-radius: 4px;">
                                                        <p class="text-primary" style="margin: 0; color: #1a1a1a; font-size: 14px; font-weight: 500; line-height: 1.5;">
                                                            ${data.arreglos.descripcion}
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-secondary" style="padding: 10px 0; color: #6b6b6b; font-size: 15px;">Cuota</td>
                                                <td class="text-primary" align="right" style="padding: 10px 0; color: #1a1a1a; font-size: 15px; font-weight: 500;">
                                                    ${data.arreglos.cuotaActual} de ${data.arreglos.cantidadCuotas}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-secondary" style="padding: 10px 0; color: #6b6b6b; font-size: 15px;">Valor a Descontar</td>
                                                <td class="text-primary" align="right" style="padding: 10px 0; color: #1a1a1a; font-size: 15px; font-weight: 500;">
                                                    ${formatToARS(data.arreglos.costoPorMes)}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" style="padding: 16px 0 12px 0;">
                                                    <div class="border-light" style="height: 1px; background-color: #e5e5e5;"></div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-primary" style="padding: 10px 0; color: #1a1a1a; font-size: 16px; font-weight: 600;">Costo Total</td>
                                                <td class="text-primary" align="right" style="padding: 10px 0; color: #1a1a1a; font-size: 18px; font-weight: 600;">
                                                    ${formatToARS(data.arreglos.costoTotal)}
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                ` : `
                                <tr>
                                    <td style="padding: 20px 0 0 0; text-align: center;">
                                        <div class="bg-light" style="padding: 35px 20px; background-color: #fafafa; border-radius: 6px;">
                                            <p class="text-secondary" style="margin: 0; color: #9b9b9b; font-size: 14px; font-weight: 500; letter-spacing: 0.5px;">
                                                NO APLICA
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                                `}
                            </table>

                            <!-- Comentarios -->
                            ${data.comentario ? `
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px;">
                                <tr>
                                    <td class="border-light" style="padding: 0 0 18px 0; border-bottom: 3px solid #1a1a1a;">
                                        <table border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="vertical-align: middle; padding-right: 10px;">
                                                    <div style="font-size: 24px;">💬</div>
                                                </td>
                                                <td style="vertical-align: middle;">
                                                    <h2 class="text-primary" style="margin: 0; color: #1a1a1a; font-size: 18px; font-weight: 600; letter-spacing: -0.3px;">
                                                        Comentarios
                                                    </h2>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 20px 0 0 0;">
                                        <div class="bg-light border-light" style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; border-left: 3px solid #6b6b6b;">
                                            <p class="text-primary" style="margin: 0; color: #4a4a4a; font-size: 15px; line-height: 1.6; font-weight: 400;">
                                                ${data.comentario}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            ` : ''}

                            <!-- Total a Pagar -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 35px;">
                                <tr>
                                    <td style="padding: 35px 30px; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); border-radius: 12px; text-align: center; border: 3px solid #000000;">
                                        <div style="font-size: 32px; margin-bottom: 12px;">💵</div>
                                        <p style="margin: 0 0 12px 0; color: #9b9b9b; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">
                                            Total a Pagar
                                        </p>
                                        <p style="margin: 0; color: #ffffff; font-size: 42px; font-weight: 600; letter-spacing: -1.5px;">
                                            ${formatToARS(data.alquilerNeto)}
                                        </p>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td class="footer-bg" style="padding: 35px 40px; background-color: #f8f9fa; border-top: 3px solid #e5e5e5; text-align: center;">
                            <p class="text-secondary" style="margin: 0 0 8px 0; color: #6b6b6b; font-size: 14px; line-height: 1.6;">
                                Gracias por todo. Cualquier consulta, estamos en contacto. 🤝
                            </p>
                            <p class="text-primary" style="margin: 0; color: #1a1a1a; font-size: 15px; font-weight: 600;">
                                Emiliano Rago · Colpayo 616 6B
                            </p>
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
