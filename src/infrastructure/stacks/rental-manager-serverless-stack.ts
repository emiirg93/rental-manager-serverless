import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export class RentalManagerServerlessStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 📊 Tabla DynamoDB para almacenar UN SOLO valor de alquiler
    const rentalTable = new dynamodb.Table(this, 'RentalTable', {
      tableName: 'rental-value',
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING
      },
      // Configuraciones para una tabla con un solo registro
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: false
      }
    });

    // 🔧 Rol IAM para las funciones Lambda
    const lambdaRole = new iam.Role(this, 'LambdaExecutionRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
    });

    // Dar permisos a Lambda para acceder a DynamoDB
    rentalTable.grantReadWriteData(lambdaRole);

    // Dar permisos a Lambda para enviar emails con SES
    lambdaRole.addToPolicy(new iam.PolicyStatement({
      actions: ['ses:SendEmail', 'ses:SendRawEmail'],
      resources: ['*'],
    }));

    // 🌍 Variables de entorno para las Lambdas
    const lambdaEnvironment = {
      TABLE_NAME: rentalTable.tableName,
      REGION: this.region,
    };

    // 🌍 Variables de entorno para la Lambda de email
    const emailLambdaEnvironment = {
      REGION: this.region,
      EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@tudominio.com',
    };

    // 📖 Lambda Function - Obtener valor de alquiler
    const getRentalValueFunction = new NodejsFunction(this, 'GetRentalValueFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: 'src/lambdas/rental/get-rental-value/index.ts',
      handler: 'handler',
      environment: lambdaEnvironment,
      role: lambdaRole,
      timeout: cdk.Duration.seconds(30),
      bundling: {
        minify: false,
        sourceMap: true,
        target: 'es2020',
      },
    });

    // ✏️ Lambda Function - Actualizar valor de alquiler
    const updateRentalValueFunction = new NodejsFunction(this, 'UpdateRentalValueFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: 'src/lambdas/rental/update-rental-value/index.ts',
      handler: 'handler',
      environment: lambdaEnvironment,
      role: lambdaRole,
      timeout: cdk.Duration.seconds(30),
      bundling: {
        minify: false,
        sourceMap: true,
        target: 'es2020',
      },
    });

    // 💰 Lambda Function - Extraer datos de expensas de PDF
    const extractExpensasFunction = new NodejsFunction(this, 'ExtractExpensasFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: 'src/lambdas/rental/extract-expensas/index.ts',
      handler: 'handler',
      environment: lambdaEnvironment,
      role: lambdaRole,
      timeout: cdk.Duration.seconds(60),
      memorySize: 1024,
      bundling: {
        minify: false,
        sourceMap: true,
        target: 'es2020',
      },
    });

    // 📧 Lambda Function - Enviar emails
    const sendEmailFunction = new NodejsFunction(this, 'SendEmailFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: 'src/lambdas/rental/send-email/index.ts',
      handler: 'handler',
      environment: emailLambdaEnvironment,
      role: lambdaRole,
      timeout: cdk.Duration.seconds(30),
      bundling: {
        minify: false,
        sourceMap: true,
        target: 'es2020',
      },
    });

    // 🌐 API Gateway REST API
    const api = new apigateway.RestApi(this, 'RentalValueApi', {
      restApiName: 'Rental Value Service',
      description: 'API para gestionar el valor de alquiler',
      binaryMediaTypes: ['multipart/form-data'], // Importante para multipart
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
      },
    });

    // 📍 Definir recursos y métodos de la API
    const rentalValue = api.root.addResource('rental-value');

    // GET /rental-value - Obtener el valor actual
    rentalValue.addMethod('GET', new apigateway.LambdaIntegration(getRentalValueFunction));

    // PUT /rental-value - Actualizar el valor
    rentalValue.addMethod('PUT', new apigateway.LambdaIntegration(updateRentalValueFunction));

    // POST /extract-expensas - Extraer datos de expensas de PDF
    const extractExpensas = api.root.addResource('extract-expensas');
    extractExpensas.addMethod('POST', new apigateway.LambdaIntegration(extractExpensasFunction), {
      requestParameters: {
        'method.request.header.Content-Type': true
      }
    });

    // POST /send-email - Enviar emails
    const sendEmail = api.root.addResource('send-email');
    sendEmail.addMethod('POST', new apigateway.LambdaIntegration(sendEmailFunction));

    // 📤 Outputs útiles
    new cdk.CfnOutput(this, 'ApiGatewayUrl', {
      value: api.url,
      description: 'URL del API Gateway',
    });

    new cdk.CfnOutput(this, 'DynamoDBTableName', {
      value: rentalTable.tableName,
      description: 'Nombre de la tabla DynamoDB para el valor de alquiler'
    });

    new cdk.CfnOutput(this, 'GetRentalValueEndpoint', {
      value: `${api.url}rental-value`,
      description: 'Endpoint para obtener/actualizar el valor de alquiler'
    });

    new cdk.CfnOutput(this, 'ExtractExpensasEndpoint', {
      value: `${api.url}extract-expensas`,
      description: 'Endpoint para extraer datos de expensas de PDF'
    });

    new cdk.CfnOutput(this, 'SendEmailEndpoint', {
      value: `${api.url}send-email`,
      description: 'Endpoint para enviar emails'
    });
  }
}