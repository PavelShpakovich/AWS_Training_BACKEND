import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/getProductsList';
import getProductsById from '@functions/getProductsById';
import createProduct from '@functions/createProduct';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-auto-swagger', 'serverless-esbuild', 'serverless-offline'],
  useDotenv: true,
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'us-east-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 'dynamodb:*',
        Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/*',
      },
    ],
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PRODUCTS_TABLE_NAME: '${env:PRODUCTS_TABLE_NAME}',
      STOCKS_TABLE_NAME: '${env:STOCKS_TABLE_NAME}',
    },
  },
  // import the function via paths
  functions: { getProductsList, getProductsById, createProduct },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    autoswagger: {
      title: 'product-service',
      apiType: 'http',
      generateSwaggerOnDeploy: true,
      typefiles: ['./src/types.ts'],
      schemes: ['https'],
      basePath: '/dev',
    },
  },
  resources: {
    Resources: {
      ProductsTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: '${env:PRODUCTS_TABLE_NAME}',
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH',
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
      },
      StocksTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: '${env:STOCKS_TABLE_NAME}',
          AttributeDefinitions: [
            {
              AttributeName: 'product_id',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'product_id',
              KeyType: 'HASH',
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
