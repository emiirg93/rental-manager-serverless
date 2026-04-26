import {
    createErrorResponse,
    createResponse,
} from '@shared';
import { UpdateRentalValueRequest } from '@shared/types';
import { ArquilerCalculateRequest, ArquilerCalculateResponse } from '@shared/types/arquiler';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import https from 'https';

const lambda = new AWS.Lambda();

/**
 * Realiza una solicitud HTTPS a la API ARquiler
 */
function fetchFromArquiler(data: ArquilerCalculateRequest): Promise<ArquilerCalculateResponse> {
  return new Promise((resolve, reject) => {
    const requestBody = JSON.stringify(data);

    const options = {
      hostname: process.env.ARQUILER_API_HOST || '',
      path: '/calculate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '',
        'X-RapidAPI-Host': process.env.ARQUILER_API_HOST || '',
      },
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsedResponse = JSON.parse(responseData);
          resolve(parsedResponse);
        } catch (error) {
          reject(new Error(`Error parsing response: ${error}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(requestBody);
    req.end();
  });
}

/**
 * Invoca la lambda update-rental-value con los datos calculados
 */
async function invokeUpdateRentalValue(
  updateData: UpdateRentalValueRequest
): Promise<any> {
  const params = {
    FunctionName: process.env.UPDATE_RENTAL_VALUE_FUNCTION_NAME || 'UpdateRentalValueFunction',
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify({
      body: JSON.stringify(updateData),
    }),
  };

  const result = await lambda.invoke(params).promise();
  
  if (result.FunctionError) {
    throw new Error(`Lambda invocation error: ${result.FunctionError}`);
  }

  return result.Payload;
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Event:', JSON.stringify(event, null, 2));

  try {
    // Validar API Key
    if (!process.env.RAPIDAPI_KEY) {
      return createErrorResponse(500, 'RAPIDAPI_KEY no configurada');
    }

    // Validar API Host
    if (!process.env.ARQUILER_API_HOST) {
      return createErrorResponse(500, 'ARQUILER_API_HOST no configurada');
    }

    if (!event.body) {
      return createErrorResponse(400, 'Body de la request es requerido');
    }

    const requestBody: ArquilerCalculateRequest = JSON.parse(event.body);

    // Validar campos requeridos
    if (!requestBody.amount || !requestBody.date || !requestBody.months || !requestBody.rate) {
      return createErrorResponse(
        400,
        'Campos requeridos: amount, date (YYYY-MM-DD), months, rate'
      );
    }

    console.log('Calling ARquiler API with:', requestBody);

    // Llamar a la API ARquiler
    const arquilerResponse = await fetchFromArquiler(requestBody);

    if (!arquilerResponse.success || !arquilerResponse.data || arquilerResponse.data.length === 0) {
      return createErrorResponse(
        400,
        'No se obtuvieron datos de la API ARquiler'
      );
    }

    // Obtener el último valor calculado (último elemento del array)
    const latestCalculation = arquilerResponse.data[arquilerResponse.data.length - 1];

    console.log('Latest calculation from ARquiler:', latestCalculation);

    // Validar que el valor no sea estimado
    if (latestCalculation.estimated) {
      return createErrorResponse(
        400,
        'No se puede actualizar el valor de alquiler porque es una estimación. El valor debe ser confirmado (estimated = false)'
      );
    }

    // Preparar datos para actualizar en DynamoDB
    const updatePayload: UpdateRentalValueRequest = {
      amount: latestCalculation.amount,
      currency: 'ARS', // ARquiler siempre devuelve en pesos argentinos
      description: `Actualizado por ARquiler - Índice: ${requestBody.rate}, Período: ${requestBody.date} a ${latestCalculation.date}, Aumento: ${latestCalculation.dif.toFixed(2)}%`
    };

    console.log('Invoking update-rental-value with:', updatePayload);

    // Invocar lambda update-rental-value
    const updateResult = await invokeUpdateRentalValue(updatePayload);

    // Parsear el resultado de la lambda
    let parsedResult = updateResult;
    if (typeof updateResult === 'string') {
      parsedResult = JSON.parse(updateResult);
    }

    console.log('Update result:', parsedResult);

    return createResponse(
      200,
      {
        arquilerData: latestCalculation,
        updateResult: parsedResult,
      },
      'Valor de alquiler actualizado exitosamente desde ARquiler'
    );

  } catch (error) {
    console.error('Error:', error);
    return createErrorResponse(
      500,
      'Error interno del servidor',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};
