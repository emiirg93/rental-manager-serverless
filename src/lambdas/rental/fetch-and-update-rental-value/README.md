# Fetch and Update Rental Value Lambda

Esta lambda integra la API ARquiler para calcular automáticamente el aumento de alquileres y actualizar el valor en la base de datos.

## Funcionalidad

1. Recibe una solicitud con parámetros de cálculo (monto, fecha, meses, tipo de índice)
2. Llama a la API ARquiler para calcular el nuevo valor del alquiler
3. Automáticamente invoca la lambda `update-rental-value` para actualizar DynamoDB
4. Devuelve los datos de ARquiler y el resultado de la actualización

## Endpoint

```
POST /sync-rental-value
```

## Request Body

```json
{
  "amount": 10000,
  "date": "2024-06-01",
  "months": 3,
  "rate": "ipc"
}
```

### Parámetros

- **amount** (number, requerido): El monto inicial del alquiler
- **date** (string, requerido): Fecha de inicio en formato YYYY-MM-DD
- **months** (number, requerido): Cantidad de meses a proyectar
- **rate** (string, requerido): Tipo de índice a utilizar
  - `icl` - Índice de Contratos de Locación
  - `ipc` - Índice de Precios al Consumidor
  - `is` - Índice Salarial
  - `ipim` - Índice de Precios Internos al por Mayor
  - `casa_propia` - Coeficiente Casa Propia
  - `cac` - Cámara Argentina de la Construcción
  - `cer` - Coeficiente de Estabilización de Referencia
  - `uva` - Unidad de Valor Adquisitivo

## Response

```json
{
  "success": true,
  "data": {
    "arquilerData": {
      "date": "2024-09-01",
      "value": 7122.24,
      "estimated": false,
      "dif": 0,
      "amount": 120000,
      "details": []
    },
    "updateResult": {
      "id": "rental-id",
      "amount": 120000,
      "currency": "ARS",
      "updatedAt": "2024-06-01T10:30:00.000Z",
      "description": "Actualizado por ARquiler - Índice: ipc, Período: 2024-06-01 a 2024-09-01, Aumento: 3.47%"
    }
  },
  "message": "Valor de alquiler actualizado exitosamente desde ARquiler"
}
```

## Variables de Entorno Requeridas

- **RAPIDAPI_KEY**: Tu API Key de RapidAPI para acceder a ARquiler (requerida)
- **ARQUILER_API_HOST**: Host de la API ARquiler (opcional, default: 'arquilerapi1.p.rapidapi.com')
- **TABLE_NAME**: Nombre de la tabla DynamoDB (configurado automáticamente)
- **REGION**: Región de AWS (configurado automáticamente)
- **UPDATE_RENTAL_VALUE_FUNCTION_NAME**: Nombre de la lambda update-rental-value (configurado automáticamente)

## Configuración

### 1. Obtener API Key de RapidAPI

1. Ir a https://rapidapi.com/jmpagella-nzr1LmjkbSI/api/arquilerapi1
2. Hacer clic en "Subscribe"
3. Seleccionar el plan deseado (hay un plan gratuito)
4. Copiar tu API Key

### 2. Configurar variables de entorno

Opción A - Para desarrollo local (en `.env`):
```
RAPIDAPI_KEY=tu_api_key_aqui
ARQUILER_API_HOST=arquilerapi1.p.rapidapi.com (opcional)
```

Opción B - Para AWS (en el deployment):
```bash
export RAPIDAPI_KEY=tu_api_key_aqui
export ARQUILER_API_HOST=arquilerapi1.p.rapidapi.com # opcional
cdk deploy
```

### 3. Compila y deploya:

```bash
npm run build
cdk deploy
```

## Ejemplo de Uso

```bash
curl -X POST https://tu-api-gateway-url/sync-rental-value \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 10000,
    "date": "2024-06-01",
    "months": 3,
    "rate": "ipc"
  }'
```

## Notas Importantes

- El valor calculado por ARquiler corresponde al **último mes del período** especificado (propiedad `amount`)
- La lambda automáticamente actualiza DynamoDB con el nuevo valor
- Solo actualiza si el valor es confirmado (`estimated: false`), rechaza estimaciones
- La descripción incluye información del cálculo (índice, período, porcentaje de aumento)
- Todos los montos son en pesos argentinos (ARS)
