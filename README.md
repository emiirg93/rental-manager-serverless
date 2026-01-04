# 🏠 Rental Manager Serverless

API serverless para gestionar valores de alquiler usando AWS CDK, Lambda y DynamoDB.

## 📋 Descripción

Este proyecto implementa una API REST serverless que permite:
- **GET** `/rental-value` - Obtener el valor actual de alquiler
- **PUT** `/rental-value` - Actualizar el valor de alquiler
- **POST** `/extract-expensas` - Extraer datos de expensas desde archivos PDF
- **POST** `/send-email` - Enviar emails con templates HTML y archivos adjuntos

## 🏗️ Arquitectura

- **AWS Lambda** (Node.js 18.x) - Funciones serverless
- **API Gateway** - Endpoint REST
- **DynamoDB** - Base de datos NoSQL (Pay-per-request)
- **AWS CDK** - Infrastructure as Code
- **TypeScript** - Lenguaje de desarrollo

## 📁 Estructura Escalable del Proyecto

```
src/
├── shared/                      # 🔄 Código compartido (reutilizable)
│   ├── types/                  # 📝 Definiciones de tipos
│   │   ├── api.ts              #   Tipos de respuestas HTTP
│   │   ├── rental.ts           #   Tipos del dominio rental
│   │   ├── multipart.ts        #   Tipos para multipart/form-data
│   │   └── index.ts            #   Re-exports centralizados
│   ├── utils/                  # 🛠️ Utilidades
│   │   ├── responses.ts        #   Helpers para respuestas HTTP
│   │   ├── validation.ts       #   Validaciones de negocio
│   │   ├── multipart.ts        #   Parser multipart/form-data y extracción PDF
│   │   └── index.ts            #   Re-exports centralizados
│   ├── constants/              # 📋 Constantes del proyecto
│   │   └── index.ts            #   Variables globales
│   ├── email-templates/        # 📧 Templates HTML para emails
│   │   ├── rental-notification.ts     #   Template notificación de alquiler
│   │   ├── payment-confirmation.ts    #   Template confirmación de pago
│   │   └── index.ts            #   Re-exports de templates
│   └── index.ts                # 🌟 Re-export principal de shared
├── lambdas/                    # ⚡ Funciones Lambda (organizadas por dominio)
│   └── rental/                 # 🏠 Dominio de alquiler
│       ├── get-rental-value/   #   Obtener valor
│       │   └── index.ts        
│       ├── update-rental-value/ #   Actualizar valor
│       │   └── index.ts        
│       ├── extract-expensas/   #   Extraer datos de expensas de PDF
│       │   └── index.ts
│       └── send-email/         #   Enviar emails con templates
│           └── index.ts        
└── infrastructure/             # 🏗️ Infraestructura como código
    └── stacks/                 # 📚 Stacks de CDK
        └── rental-manager-serverless-stack.ts
```

### 🎯 Beneficios de esta Estructura:

- ✅ **Escalabilidad**: Fácil agregar nuevos dominios (`notifications/`, `users/`, etc.)
- ✅ **Reutilización**: `@shared` usado en lambdas e infraestructura  
- ✅ **Organización**: Separación clara por responsabilidades
- ✅ **Mantenibilidad**: Cada módulo tiene una responsabilidad específica
- ✅ **Path Mappings**: Imports limpios con `@shared`, `@lambdas`, etc.

## 🚀 Deployment

### Prerrequisitos
- Node.js 18+
- AWS CLI configurado
- CDK CLI: `npm install -g aws-cdk`
Dependencias principales:
- `busboy` - Parser para multipart/form-data
- `pdf2json` - Extracción de texto de archivos PDF
- `nodemailer` - Envío de emails con soporte de adjuntos y templates HTML
npm install
```

Dependencias principales:
- `busboy` - Parser para multipart/form-data
- `pdf2json` - Extracción de texto de archivos PDF

## 📄 Funcionalidad de Extracción de Expensas

### POST `/extract-expensas`

Extrae automáticamente los siguientes datos de archivos PDF de expensas:
- **Expensas Ordinarias**: Monto de gastos ordinarios
- **Expensas Extraordinarias**: Monto de gastos extraordinarios
- **Total 1er Vencimiento**: Monto total a pagar
- **Fecha de Vencimiento**: Fecha límite de pago

**Respuesta exitosa:**
```json
{
  "mensaje": "Datos de expensas extraídos exitosamente",
  "archivo": {
    "nombre": "expensas.pdf",
    "tamaño": 245678,
    "tipo": "application/pdf"
  },
  "expensas": {
    "expensasOrdinarias": 146732.19,
    "expensasExtraordinarias": 42400.00,
    "total1erVencimiento": 193686.27,
    "fechaVencimiento": "10/11/2025"
  }
}
```
**Características:**
- ✅ Maneja PDFs con texto espaciado (formato: "E x p . O r d i n a r i a s")
- ✅ Parsea automáticamente números con formato argentino (puntos de miles, comas decimales)
- ✅ Extrae fechas en formato DD/MM/YYYY
- ✅ Validación de tamaño máximo: 10MB
- ✅ Solo acepta archivos PDF
## 📧 Funcionalidad de Envío de Emails

### POST `/send-email`

Envía emails con templates HTML profesionales y soporte para archivos adjuntos usando Gmail vía Nodemailer.

#### **Opción 1: Con Template Predefinido**

**Request (multipart/form-data):**
```
to: destinatario@ejemplo.com
subject: Recordatorio de Pago - Alquiler Diciembre
template: rental-notification
templateData: {"recipientName":"Juan Pérez","rentalAmount":50000,"dueDate":"20/12/2025","propertyAddress":"Av. Corrientes 1234, CABA"}
file: [archivo.pdf] (opcional)
```

**Templates Disponibles:**
- **`rental-notification`**: Notificación de alquiler con monto y fecha de vencimiento
  - Campos: `recipientName`, `rentalAmount`, `dueDate`, `propertyAddress` (opcional)
- **`payment-confirmation`**: Confirmación de pago con recibo
  - Campos: `recipientName`, `amount`, `paymentDate`, `receiptNumber`, `propertyAddress` (opcional)

#### **Opción 2: HTML Personalizado**

**Request:**
```
to: destinatario@ejemplo.com
subject: Mi mensaje
html: <h1>Hola</h1><p>Contenido HTML</p>
file: [archivo.pdf] (opcional)
```

#### **Opción 3: Texto Plano**

**Request:**
```
to: destinatario@ejemplo.com
subject: Mi mensaje
text: Contenido en texto plano
file: [archivo.pdf] (opcional)
```

**Respuesta exitosa:**
```json
{
  "data": {
    "messageId": "<xxx@gmail.com>",
    "accepted": ["destinatario@ejemplo.com"],
    "rejected": [],
    "attachmentsCount": 1,
    "template": "rental-notification"
  },
  "message": "Email enviado exitosamente"
}
```

**Características:**
- ✅ Templates HTML responsivos y profesionales
- ✅ Soporte para múltiples archivos adjuntos
- ✅ Multipart/form-data para envío de archivos
- ✅ Datos dinámicos con TypeScript tipado
- ✅ Integración con Gmail vía Nodemailer

**Configuración Requerida:**

Variables de entorno (GitHub Secrets):
- `EMAIL_USER`: Tu email de Gmail
- `EMAIL_PASSWORD`: Contraseña de aplicación de Gmail (no tu contraseña normal)

Para generar una contraseña de aplicación:
1. Ve a https://myaccount.google.com/security
2. Activa la verificación en 2 pasos
3. Ve a "Contraseñas de aplicación"
4. Genera una nueva contraseña para "Correo"

## 🔧 Tecnologías

- **Runtime**: Node.js 18.x
- **Language**: TypeScript 5.9+
- **IaC**: AWS CDK 2.x
- **Parser**: Busboy (multipart/form-data)
- **PDF**: pdf2json (text extraction)
- **Email**: Nodemailer (Gmail SMTP)
- **Database**: DynamoDB
- **API**: API Gateway REST
- **Functions**: AWS Lambda

## 🌍 Endpoints Desplegados

- **API Base**: `https://kyoft1tqg9.execute-api.us-east-1.amazonaws.com/prod/`
- **GET/PUT /rental-value**: Gestión de valor de alquiler
- **POST /extract-expensas**: Extracción de datos de expensas desde PDF
- **POST /send-email**: Envío de emails con templates HTML y adjuntos
- **POST /extract-expensas**: Extracción de datos de expensas desde PDF
