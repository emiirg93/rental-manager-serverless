import {
  createErrorResponse,
  createResponse,
  extraerTextoOrdenado,
  parseMultipartFormData,
  validateFileMimeType,
  validateFileSize,
} from '@shared';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// Configuración para validación de archivos PDF
const MAX_FILE_SIZE_MB = 10;
const ALLOWED_MIME_TYPES = ['application/pdf'];

interface ExpensasExtraidas {
  ordinarias: number | null;
  extraordinarias: number | null;
  total1erVencimiento: number | null;
  fechaVencimiento: string | null;
}

/**
 * Extrae los montos de expensas de un texto
 */
function extraerExpensas(texto: string): ExpensasExtraidas {
  const resultado: ExpensasExtraidas = {
    ordinarias: null,
    extraordinarias: null,
    total1erVencimiento: null,
    fechaVencimiento: null,
  };

  // Normalizar el texto: eliminar espacios entre caracteres individuales
  // El PDF viene con formato: "E x p . O r d i n a r i a s"
  const textoNormalizado = texto.replace(/\s+/g, ' ').trim();

  // Buscar "Exp. Ordinarias" - el texto viene como "E x p . O r d i n a r i a s"
  const regexOrdinarias = /E\s*x\s*p\s*\.\s*O\s*r\s*d\s*i\s*n\s*a\s*r\s*i\s*a\s*s\s*\$?\s*([\d\s.,]+)/i;
  const matchOrdinarias = textoNormalizado.match(regexOrdinarias);
  if (matchOrdinarias) {
    // Limpiar el número: remover espacios, convertir puntos de miles y comas decimales
    const numeroLimpio = matchOrdinarias[1].replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
    resultado.ordinarias = parseFloat(numeroLimpio);
  }

  // Buscar "Exp. Extraord." - el texto viene como "E x p . E x t r a o r d ."
  const regexExtraord = /E\s*x\s*p\s*\.\s*E\s*x\s*t\s*r\s*a\s*o\s*r\s*d\s*\.\s*\$?\s*([\d\s.,]+)/i;
  const matchExtraord = textoNormalizado.match(regexExtraord);
  if (matchExtraord) {
    const numeroLimpio = matchExtraord[1].replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
    resultado.extraordinarias = parseFloat(numeroLimpio);
  }

  // Buscar "Total 1º vto" - el texto viene como "T o t a l 1 º v t o : 1 0 / 1 1 / 2 0 2 5"
  const regexTotal = /T\s*o\s*t\s*a\s*l\s*1\s*[ºer]+\s*v\s*t\s*o\s*[:.]?\s*([\d\s\/]+)\s*\$?\s*([\d\s.,]+)/i;
  const matchTotal = textoNormalizado.match(regexTotal);
  if (matchTotal) {
    // Limpiar la fecha y el monto
    resultado.fechaVencimiento = matchTotal[1].replace(/\s/g, '');
    const numeroLimpio = matchTotal[2].replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
    resultado.total1erVencimiento = parseFloat(numeroLimpio);
  }

  return resultado;
}

/**
 * Lambda handler para extraer datos específicos de expensas de un PDF
 */
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('Event:', JSON.stringify(event, null, 2));

  try {
    // Parsear los datos multipart
    const { fields, files } = await parseMultipartFormData(event);

    console.log('Fields:', fields);
    console.log(
      'Files:',
      files.map((f) => ({
        fieldname: f.fieldname,
        filename: f.filename,
        mimetype: f.mimetype,
        size: f.size,
      }))
    );

    // Validar que se haya subido al menos un archivo
    if (files.length === 0) {
      return createErrorResponse(400, 'No se encontraron archivos en la solicitud');
    }

    // Validar el primer archivo
    const file = files[0];

    // Validar tamaño
    if (!validateFileSize(file, MAX_FILE_SIZE_MB)) {
      return createErrorResponse(
        400,
        `El archivo "${file.filename}" excede el tamaño máximo de ${MAX_FILE_SIZE_MB}MB`
      );
    }

    // Validar tipo MIME
    if (!validateFileMimeType(file, ALLOWED_MIME_TYPES)) {
      return createErrorResponse(
        400,
        `El archivo "${file.filename}" debe ser un PDF (tipo recibido: ${file.mimetype})`
      );
    }

    // Extraer texto del PDF
    console.log('Extrayendo texto del PDF...');
    const textoExtraido = await extraerTextoOrdenado(file);

    console.log(`Texto extraído: ${textoExtraido.length} caracteres`);
    console.log('Primeros 500 caracteres:', textoExtraido.substring(0, 500));

    // Extraer los datos de expensas
    const expensas = extraerExpensas(textoExtraido);

    console.log('Expensas extraídas:', expensas);

    // Validar que se hayan encontrado al menos algunos datos
    if (
      expensas.ordinarias === null &&
      expensas.extraordinarias === null &&
      expensas.total1erVencimiento === null
    ) {
      return createResponse(200, {
        mensaje: 'No se pudieron extraer los datos de expensas del PDF',
        archivo: {
          nombre: file.filename,
          tamaño: file.size,
        },
        textoExtraido: textoExtraido.substring(0, 1000), // Primeros 1000 caracteres para debug
        expensas: null,
      });
    }

    // Respuesta con los datos extraídos
    return createResponse(200, {
      mensaje: 'Datos de expensas extraídos exitosamente',
      archivo: {
        nombre: file.filename,
        tamaño: file.size,
        tipo: file.mimetype,
      },
      expensas,
      // Incluir campos adicionales si se enviaron
      ...(Object.keys(fields).length > 0 && { campos: fields }),
    });
  } catch (error) {
    console.error('Error:', error);

    if (error instanceof Error) {
      if (error.message.includes('Content-Type')) {
        return createErrorResponse(400, 'Formato de solicitud inválido', error.message);
      }

      if (error.message.includes('PDF')) {
        return createErrorResponse(400, 'Error procesando el PDF', error.message);
      }
    }

    return createErrorResponse(
      500,
      'Error interno del servidor',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};
