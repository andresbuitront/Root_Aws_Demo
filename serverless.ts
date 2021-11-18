import type { AWS } from '@serverless/typescript';

import hello from '@functions/hello';
import queue from '@functions/queue';

// DynamoDB
import dynamoDbTables from './resources/dynamodb-tables';
import sqsQueues from './resources/sqs-queues';

const serverlessConfiguration: AWS = {
  service: 'root-aws-demo',
  frameworkVersion: '2',
  custom: {
    // this is part of dinamodb
    region: '${opt:region, self:provider.region}',
    stage: '${opt:stage, self:provider.stage}',
    list_table: '${self:service}-list-table-${opt:stage, self:provider.stage}',
    tasks_table: '${self:service}-tasks-table-${opt:stage, self:provider.stage}',
    custom_queue_name: '${self:service}-custom-queue-${opt:stage, self:provider.stage}',
    table_throughputs: {
      prod: 5,
      default: 1,
    },
    table_throughput: '${self:custom.TABLE_THROUGHPUTS.${self:custom.stage}, self:custom.table_throughputs.default}',
    dynamodb: {
      stages: ['dev'],
      start: {
        port: 8008,
        inMemory: true,
        heapInitial: '200m',
        heapMax: '1g',
        migrate: true,
        seed: true,
        convertEmptyValues: true,
        // Uncomment only if you already have a DynamoDB running locally
        // noStart: true
      }
    },
    ['serverless-offline']: {
      httpPort: 3000,
      babelOptions: {
        presets: ["env"]
      }
    },
    //final of bynamo db
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
  },
  plugins: ['serverless-esbuild',
  'serverless-dynamodb-local',
    'serverless-bundle',
    'serverless-offline',
    'serverless-dotenv-plugin'],
  package: { individually: true },
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: 'dev',
    region: 'us-east-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      //step 3 tuto
      REGION: '${self:custom.region}',
      STAGE: '${self:custom.stage}',
      LIST_TABLE: '${self:custom.list_table}',
      TASKS_TABLE: '${self:custom.tasks_table}',
      QUEUE_URL: {
        Ref:'TestQueue'
      }
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
            'dynamodb:DescribeTable',
            'dynamodb:Query',
            'dynamodb:Scan',
            'dynamodb:GetItem',
            'dynamodb:PutItem',
            'dynamodb:UpdateItem',
            'dynamodb:DeleteItem'
        ],
        Resource: [
          {"Fn::GetAtt": [ 'ListTable', 'Arn' ]},
          {"Fn::GetAtt": [ 'TasksTable', 'Arn' ]}
        ]
      },
      {
        Effect: 'Allow',
        Action: [
            'sqs:SendMessage',
            'sqs:ReceiveMessage',
            'sqs:DeleteMessage',
            'sqs:GetQueueUrl',
        ],
        Resource: [
          { "Fn::GetAtt": ['TestQueue', 'Arn'] }
        ]
      }
    ]
  },
  resources: {
    Resources: {...dynamoDbTables, ...sqsQueues},
  },
  // import the function via paths
  functions: { hello, queue }



};

module.exports = serverlessConfiguration;
