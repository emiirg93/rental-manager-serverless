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

    // 🌍 Variables de entorno para las Lambdas
    const lambdaEnvironment = {
      TABLE_NAME: rentalTable.tableName,
      REGION: this.region,
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

    // 🌐 API Gateway REST API
    const api = new apigateway.RestApi(this, 'RentalValueApi', {
      restApiName: 'Rental Value Service',
      description: 'API para gestionar el valor de alquiler',
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
  }
}