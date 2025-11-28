# 🏠 Rental Manager Serverless

API serverless para gestionar valores de alquiler usando AWS CDK, Lambda y DynamoDB.

## 📋 Descripción

Este proyecto implementa una API REST serverless que permite:
- **GET** `/rental-value` - Obtener el valor actual de alquiler
- **PUT** `/rental-value` - Actualizar el valor de alquiler

## 🏗️ Arquitectura

- **AWS Lambda** (Node.js 18.x) - Funciones serverless
- **API Gateway** - Endpoint REST
- **DynamoDB** - Base de datos NoSQL (Pay-per-request)
- **AWS CDK** - Infrastructure as Code
- **TypeScript** - Lenguaje de desarrollo

## 🚀 Deployment

### Prerrequisitos
- Node.js 18+ 
- AWS CLI configurado
- CDK CLI: `npm install -g aws-cdk`

### Comandos

```bash
# Instalar dependencias
npm install

# Compilar TypeScript
npm run build

# Sintetizar CloudFormation
npx cdk synth

# Desplegar a AWS
npx cdk deploy

# Ver diferencias con el stack actual
npx cdk diff

# Destruir el stack
npx cdk destroy
```

## 📁 Estructura del Proyecto

```
├── bin/                          # Entry point de CDK
├── lib/                          # Stack de infraestructura
├── lambda/
│   ├── getRentalValue/          # Lambda para GET
│   ├── updateRentalValue/       # Lambda para PUT  
│   └── shared/                  # Tipos y utilidades compartidas
├── cdk.json                     # Configuración CDK
├── package.json                 # Dependencias del proyecto
└── tsconfig.json               # Configuración TypeScript
```

## 🔧 API Endpoints

### GET /rental-value
Obtiene el valor actual de alquiler.

**Response:**
```json
{
  "id": "current",
  "amount": 150000,
  "currency": "ARS", 
  "updatedAt": "2025-11-28T05:02:06.023Z",
  "description": "Alquiler mensual"
}
```

### PUT /rental-value
Actualiza el valor de alquiler.

**Request:**
```json
{
  "amount": 150000,
  "currency": "ARS",
  "description": "Nuevo valor de alquiler"
}
```

## 🛠️ Desarrollo

```bash
# Modo watch para compilación automática
npm run watch

# Ver logs de CloudWatch (después del deploy)
npx cdk logs GetRentalValueFunction --follow
```
