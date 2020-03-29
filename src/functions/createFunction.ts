import { APIGatewayProxyHandler } from 'aws-lambda';

// TODO: move aws intance to a new file/class
const AWS = require('aws-sdk');

const lambda = new AWS.Lambda({ region: 'us-east-1' });


const runtime: string = 'nodejs12.x';
const ARN_ROLE: string = 'arn:aws:iam::964189167587:role/etherless-dev';
const FN_TIMEOUT = 30;

const createFunction: APIGatewayProxyHandler = async (event) => {
  const data = JSON.parse(event.body);
  const buffer = Buffer.from(data.zip, 'utf8');
  const functionToStore = {
    Code: {
      ZipFile: buffer,
    },
    FunctionName: data.name,
    Handler: `${data.name}.handler`,
    MemorySize: 128,
    Publish: true,
    Role: ARN_ROLE,
    Runtime: runtime,
    Timeout: FN_TIMEOUT,
    VpcConfig: {
    },
  };
  const prom = new Promise((resolve, reject) => {
    lambda.createFunction(functionToStore, (err: any, rData: any) => {
      if (err) reject(err);
      else resolve(rData);
    });
  });

  let ARN = '';
  await prom.then((result) => {
    ARN = (JSON.stringify(result));
  });
  return { statusCode: 200, body: ARN };
};

export default createFunction;
