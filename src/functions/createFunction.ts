import { APIGatewayProxyHandler } from 'aws-lambda';
import AWSInstance from '../awsInstance';

const AWS = new AWSInstance();

export const createFunction:APIGatewayProxyHandler = async (event) => {
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
    Role: AWS.getArnRole(),
    Runtime: AWS.getRuntime(),
    Timeout: AWS.getFnTimeout(),
    VpcConfig: {
    },
  };
  const prom = new Promise((resolve, reject) => {
    AWS.getLambda().createFunction(functionToStore, (err: any, rData: any) => {
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
