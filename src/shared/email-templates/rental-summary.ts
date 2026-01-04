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
    <!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="es">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Detalle de Pago de Alquiler</title>
</head>

<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f7fa; color: #333333;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%"
        style="max-width: 600px; margin: 0 auto; background-color: #f5f7fa;">
        <tr>
            <td align="center" style="padding: 40px 20px 30px 20px;">
                <h1 style="color: #333333; font-size: 28px; font-weight: 500; margin: 0;">Resumen</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 0 20px;">
                <!-- Alquiler -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%"
                    style="margin-bottom: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <tr>
                        <td style="padding: 20px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="padding-bottom: 15px;">
                                        <span style="color: #4355b9; font-size: 18px; font-weight: 600;">Alquiler</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="right" style="font-size: 24px; font-weight: 600; color: #4355b9;">
                                <tr>
                                    <td align="right" style="font-size: 24px; font-weight: 600; color: #4355b9;">
                                        ${formatToARS(data.alquilerBruto)}
                                    </td>
                                </tr>
                    </tr>
                </table>
                <!-- Expensas -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%"
                    style="margin-bottom: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <tr>
                        <td style="padding: 20px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="padding-bottom: 15px;">
                                        <span style="color: #4355b9; font-size: 18px; font-weight: 600;">Expensas</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%"
                                            style="margin-bottom: 10px;">
                                            <tr>
                                                <td style="font-size: 14px; color: #666666;">Extraordinarias</td>
                                                <td align="right"
                                                    style="font-size: 14px; font-weight: 500; color: #333333;">
                                                    ${formatToARS(data.expensas.extraordinarias)}</td>
                                            </tr>
                                        </table>
                                        <hr
                                            style="border: none; height: 1px; background-color: #e5e7eb; margin: 10px 0;" />
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td style="font-size: 14px; font-weight: 500; color: #333333;">Total
                                                </td>
                                                <td align="right"
                                                    style="font-size: 16px; font-weight: 600; color: #4355b9;">
                                                    ${formatToARS(data.expensas.total1erVencimiento || data.expensas.extraordinarias)}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                <!-- ARREGLOS DEPARTAMENTO -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%"
                    style="margin-bottom: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <tr>
                        <td style="padding: 20px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="padding-bottom: 15px;">
                                        <span style="color: #4355b9; font-size: 18px; font-weight: 600;">Arreglo
                                            Departamento</span>
                                    </td>
                                </tr>
                                ${
                                  data.arreglos
                                    ? `
                                <tr>
                                    <td>
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%"
                                            style="margin-bottom: 10px;">
                                            <tr>
                                                <td style="font-size: 14px; color: #666666;">Descripcion</td>
                                                <td align="right"
                                                    style="font-size: 14px; font-weight: 500; color: #333333;">
                                                    ${data.arreglos.descripcion || 'N/A'}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="font-size: 14px; color: #666666;">Cantidad de Cuotas</td>
                                                <td align="right"
                                                    style="font-size: 14px; font-weight: 500; color: #333333;">
                                                    ${data.arreglos.cantidadCuotas || 'N/A'}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="font-size: 14px; color: #666666;">Cuota Actual</td>
                                                <td align="right"
                                                    style="font-size: 14px; font-weight: 500; color: #333333;">
                                                    ${data.arreglos.cuotaActual || 'N/A'}/${data.arreglos.cantidadCuotas || 'N/A'}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="font-size: 14px; color: #666666;">Valor a Descontar</td>
                                                <td align="right"
                                                    style="font-size: 14px; font-weight: 500; color: #333333;">
                                                    ${
                                                      data.arreglos
                                                        .costoPorMes
                                                        ? formatToARS(
                                                            data
                                                              .arreglos
                                                              .costoPorMes,
                                                          )
                                                        : 'N/A'
                                                    }
                                                </td>
                                            </tr>
                                        </table>
                                        <hr
                                            style="border: none; height: 1px; background-color: #e5e7eb; margin: 10px 0;" />
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td style="font-size: 14px; font-weight: 500; color: #333333;">Costo Total del Arreglo
                                                </td>
                                                <td align="right"
                                                    style="font-size: 16px; font-weight: 600; color: #4355b9;">
                                                    ${
                                                      data.arreglos
                                                        .costoTotal
                                                        ? formatToARS(
                                                            data
                                                              .arreglos
                                                              .costoTotal,
                                                          )
                                                        : '$0'
                                                    }
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                `
                                    : `
                                <tr>
                                    <td style="text-align: center; padding: 25px 0;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td
                                                    style="text-align: center; padding: 20px; border: 2px dashed #e5e7eb; border-radius: 8px; background-color: #f9fafb;">
                                                    <span
                                                        style="font-size: 16px; font-weight: 600; color: #666666; letter-spacing: 1px;">
                                                        NO APLICA
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                `
                                }
                            </table>
                        </td>
                    </tr>
                </table>
                <!-- Comentarios -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%"
                    style="margin-bottom: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <tr>
                        <td style="padding: 20px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="padding-bottom: 15px;">
                                        <span style="color: #4355b9; font-size: 18px; font-weight: 600;">Comentarios</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        style="padding: 15px; background-color: #f9fafb; border-radius: 6px; font-size: 14px; color: #4b5563; line-height: 1.5;">
                                        ${data.comentario || 'No hay comentarios adicionales para este mes.'}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                <!-- Total a Pagar -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%"
                    style="margin-bottom: 20px; background-color: #4355b9; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="padding: 20px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" style="padding-bottom: 10px;">
                                        <span style="color: #ffffff; font-size: 18px; font-weight: 600;">
                                            Total a Pagar - ${monthName()}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="font-size: 28px; font-weight: 700; color: #ffffff;">
                                        ${formatToARS(data.alquilerNeto)}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center;">
                <p style="margin: 0 0 10px; font-size: 14px; color: #718096; font-style: italic;">Gracias por todo.
                    Cualquier consulta, estamos en contacto.</p>
                <p style="margin: 0; font-size: 16px; font-weight: 500; color: #4a5568;">Emiliano Rago - Colpayo 616 6B
                </p>
            </td>
        </tr>
    </table>
</body>

</html>
  `.trim();
};
