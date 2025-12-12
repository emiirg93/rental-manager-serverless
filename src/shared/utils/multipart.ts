import { APIGatewayProxyEvent } from 'aws-lambda';
import Busboy from 'busboy';
import PDFParser from 'pdf2json';
import { Readable } from 'stream';
import { ParsedFile, ParsedMultipartData } from '../types';

/**
 * Parsea datos multipart/form-data de un evento de API Gateway
 * @param event - Evento de API Gateway
 * @returns Promise con los campos y archivos parseados
 */
export const parseMultipartFormData = (
  event: APIGatewayProxyEvent
): Promise<ParsedMultipartData> => {
  return new Promise((resolve, reject) => {
    const contentType = event.headers['content-type'] || event.headers['Content-Type'];
    
    if (!contentType || !contentType.includes('multipart/form-data')) {
      reject(new Error('Content-Type debe ser multipart/form-data'));
      return;
    }

    const fields: Record<string, string> = {};
    const files: ParsedFile[] = [];

    // API Gateway puede enviar el body en base64
    const body = event.isBase64Encoded
      ? Buffer.from(event.body || '', 'base64')
      : event.body || '';

    // Convertir el body a stream
    const bufferStream = new Readable();
    bufferStream.push(body);
    bufferStream.push(null);

    const busboy = Busboy({ 
      headers: { 
        'content-type': contentType 
      } 
    });

    // Manejar campos de texto
    busboy.on('field', (fieldname: string, value: string) => {
      fields[fieldname] = value;
    });

    // Manejar archivos
    busboy.on('file', (fieldname: string, file: NodeJS.ReadableStream, info: { filename: string; encoding: string; mimeType: string }) => {
      const chunks: Buffer[] = [];
      
      file.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      file.on('end', () => {
        const buffer = Buffer.concat(chunks);
        files.push({
          fieldname,
          filename: info.filename,
          encoding: info.encoding,
          mimetype: info.mimeType,
          buffer,
          size: buffer.length,
        });
      });

      file.on('error', (error: Error) => {
        reject(error);
      });
    });

    // Cuando termine de parsear
    busboy.on('finish', () => {
      resolve({ fields, files });
    });

    // Manejo de errores
    busboy.on('error', (error: Error) => {
      reject(error);
    });

    // Enviar el stream a busboy
    bufferStream.pipe(busboy);
  });
};

/**
 * Valida el tamaño máximo de un archivo
 * @param file - Archivo a validar
 * @param maxSizeInMB - Tamaño máximo en MB
 * @returns true si el archivo es válido
 */
export const validateFileSize = (file: ParsedFile, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

/**
 * Valida el tipo MIME de un archivo
 * @param file - Archivo a validar
 * @param allowedMimeTypes - Array de tipos MIME permitidos
 * @returns true si el tipo MIME es válido
 */
export const validateFileMimeType = (file: ParsedFile, allowedMimeTypes: string[]): boolean => {
  return allowedMimeTypes.includes(file.mimetype);
};

/**
 * Valida la extensión de un archivo
 * @param file - Archivo a validar
 * @param allowedExtensions - Array de extensiones permitidas (sin el punto)
 * @returns true si la extensión es válida
 */
export const validateFileExtension = (file: ParsedFile, allowedExtensions: string[]): boolean => {
  const extension = file.filename.split('.').pop()?.toLowerCase();
  return extension ? allowedExtensions.includes(extension) : false;
};

/**
 * Extrae texto ordenado de un archivo PDF
 * Adaptado de NestJS para funcionar con ParsedFile
 * Usa pdf2json que funciona nativamente en Node.js/Lambda sin dependencias del DOM
 * @param file - Archivo PDF parseado
 * @returns Promise con el texto completo extraído del PDF
 */
export const extraerTextoOrdenado = async (
  file: ParsedFile,
): Promise<string> => {
  // Validar que sea un PDF
  if (file.mimetype !== 'application/pdf') {
    throw new Error('El archivo debe ser un PDF');
  }

  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    // Manejar errores
    pdfParser.on('pdfParser_dataError', (errData: any) => {
      reject(new Error(`Error parseando PDF: ${errData.parserError}`));
    });

    // Cuando termine de parsear
    pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
      try {
        let textoCompleto = '';

        // Recorrer todas las páginas
        if (pdfData.Pages) {
          for (const page of pdfData.Pages) {
            if (page.Texts) {
              // Ordenar los textos por posición Y (descendente) y luego X (ascendente)
              const textItems = page.Texts.map((text: any) => ({
                x: text.x,
                y: text.y,
                text: decodeURIComponent(text.R[0].T)
              }));

              // Ordenar: primero por Y (arriba a abajo), luego por X (izquierda a derecha)
              textItems.sort((a: any, b: any) => {
                // Si están en la misma línea (diferencia Y < 0.5)
                if (Math.abs(b.y - a.y) < 0.5) {
                  return a.x - b.x; // Ordenar por X
                }
                return b.y - a.y; // Ordenar por Y (invertido para ir de arriba a abajo)
              });

              // Unir el texto
              const textoPagina = textItems.map((item: any) => item.text).join(' ');
              textoCompleto += textoPagina + '\n';
            }
          }
        }

        resolve(textoCompleto.trim());
      } catch (error) {
        reject(new Error(`Error procesando datos del PDF: ${error}`));
      }
    });

    // Parsear el buffer
    pdfParser.parseBuffer(file.buffer);
  });
};


