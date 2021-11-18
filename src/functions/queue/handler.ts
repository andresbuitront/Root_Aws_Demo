import { SQSHandler } from 'aws-lambda';

const hello: SQSHandler = async (event, _context, callback) => {
  console.log('[Queue]: Record %j', event);
  callback(null);
}

export const main = hello;
