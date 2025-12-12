/**
 * Representa un archivo parseado de multipart/form-data
 */
export interface ParsedFile {
  fieldname: string;
  filename: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

/**
 * Resultado del parseo de datos multipart/form-data
 */
export interface ParsedMultipartData {
  fields: Record<string, string>;
  files: ParsedFile[];
}

/**
 * Configuración para validación de archivos
 */
export interface FileValidationConfig {
  maxSizeInMB?: number;
  allowedMimeTypes?: string[];
  allowedExtensions?: string[];
}
