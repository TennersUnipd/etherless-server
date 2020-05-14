/**
 * @file createFunction.ts
 * @class FunctionDeployer
 * @methods createFunction
 */
import { APIGatewayProxyHandler } from 'aws-lambda';
import config from '../config.json';

import AWS = require('aws-sdk');

/**
 * @class FunctionDeployer
 */
export class FunctionDeployer {
  private aws: AWS.Lambda;

  constructor(aws: AWS.Lambda) {
    this.aws = aws;
  }

  /**
   * @function
   * @param parsedData
   * @returns a data structure fot the deploy of a new function
   * prepare the data structure for the request
   */
  // eslint-disable-next-line class-methods-use-this
  public prepareFunctionToStore(parsedData: any): any {
    return {
      Code: {
        ZipFile: Buffer.from(parsedData.zip, 'utf8'),
      },
      FunctionName: parsedData.name,
      Handler: `${parsedData.name}.handler`,
      MemorySize: 128,
      Publish: true,
      Role: config.ARN_ROLE,
      Runtime: config.runtime,
      Timeout: config.FN_TIMEOUT,
      VpcConfig: {
      },
    };
  }

  /**
   * @function updateFunction
   * @param data
   * @returns Promise that contains the result of the remote call;
   * sends the request to the AWS service and encapsulate it in a promise
   */
  public uploadFunction(data): Promise<any> {
    const functionSerialized = this.prepareFunctionToStore(data);
    return new Promise((resolve, reject) => {
      this.aws.createFunction(functionSerialized, (err: any, rData) => {
        if (err) reject(err);
        else resolve(rData);
      });
    });
  }
}

/**
 * @function createFunction
 * @param event
 * Instantiate the FunctionDeployer class and returns the ARN of deploy
 */
export const createFunction: APIGatewayProxyHandler = async (event) => {
  const deployer = new FunctionDeployer(new AWS.Lambda({ region: config.region }));
  const data = JSON.parse(event.body);

  const prom = deployer.uploadFunction(data);

  let ARN = '';
  await prom.then((result) => {
    ARN = (JSON.stringify(result));
  });
  return { statusCode: 200, body: ARN };
};

export default createFunction;
