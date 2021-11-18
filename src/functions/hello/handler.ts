import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import DatabaseService from "../../services/database.service";
import * as AWS from 'aws-sdk';


const databaseService = new DatabaseService();

const SQS = new AWS.SQS({
  region: process.env.REGION,
  apiVersion: '2012-11-05',
});


const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  const params = {
    MessageBody: JSON.stringify({ message: 'HOLA' }) /* required */,
    QueueUrl: process.env.QUEUE_URL /* required */,
    // DelaySeconds: 'NUMBER_VALUE',
  };

  await SQS.sendMessage(params).promise();
  const dbparams = {
    TableName: process.env.LIST_TABLE,
    Item: {
      id: '123',
      name: 'ivan'
    }
  }
  await databaseService.create(dbparams);

  return formatJSONResponse({
    message: `Hello Test welcome to the exciting Serverless world!`,
    // message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
    event,
  });
}

export const main = middyfy(hello);
