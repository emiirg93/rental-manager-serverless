# 🏠 Rental Manager Serverless

API serverless para gestionar valores de alquiler usando AWS CDK, Lambda y DynamoDB.

## 📋 Descripción

Este proyecto implementa una API REST serverless que permite:
- **GET** `/rental-value` - Obtener el valor actual de alquiler
- **PUT** `/rental-value` - Actualizar el valor de alquiler
- **DELETE** `/rental-value` - Eliminar el valor de alquiler (ejemplo escalabilidad)

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
│   │   └── index.ts            #   Re-exports centralizados
│   ├── utils/                  # 🛠️ Utilidades
│   │   ├── responses.ts        #   Helpers para respuestas HTTP
│   │   ├── validation.ts       #   Validaciones de negocio
│   │   └── index.ts            #   Re-exports centralizados
│   ├── constants/              # 📋 Constantes del proyecto
│   │   └── index.ts            #   Variables globales
│   └── index.ts                # 🌟 Re-export principal de shared
├── lambdas/                    # ⚡ Funciones Lambda (organizadas por dominio)
│   └── rental/                 # 🏠 Dominio de alquiler
│       ├── get-rental-value/   #   Obtener valor
│       │   └── index.ts        
│       ├── update-rental-value/ #   Actualizar valor
│       │   └── index.ts        
│       └── delete-rental-value/ #   Eliminar valor (ejemplo)
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
