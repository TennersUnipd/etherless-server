/**
 * @file updateFunction.ts
 * @class FunctionUpdater
 * @methods updateFunction
 */
import { APIGatewayProxyHandler } from 'aws-lambda';
import config from '../config.json';

import AWS = require('aws-sdk');

/**
 * @class FunctionUpdater
 */
export class FunctionUpdater {
  private aws: AWS.Lambda;

  constructor(aws: AWS.Lambda) {
    this.aws = aws;
  }

  /**
   * function prepareFunctionToUpdate
   * @param parsedData
   * prepares the data structure for the update
   */
  // eslint-disable-next-line class-methods-use-this
  public prepareFunctionToUpdate(parsedData: any): any {
    return {
      FunctionName: parsedData.ARN,
      ZipFile: Buffer.from(parsedData.zip, 'utf8'),
      Publish: true,
    };
  }

  /**
   * @function letUpdateFunction
   * @param data
   * prepare and sends the request to the AWS service for the upload of a new function
   */
  public letUpdateFunction(data): Promise<any> {
    const functionSerialized = this.prepareFunctionToUpdate(data);
    return new Promise((resolve, reject) => {
      this.aws.updateFunctionCode(functionSerialized, (err: any, rData) => {
        if (err) reject(err);
        else resolve(rData);
      });
    });
  }
}

/**
 * @function deleteFunction
 * @param event
 * Instantiate the class FunctionUpdater and returns the result
 */
export const updateFunction: APIGatewayProxyHandler = async (event) => {
  const deployer = new FunctionUpdater(new AWS.Lambda({ region: config.region }));
  const data = JSON.parse(event.body);
  const prom = deployer.letUpdateFunction(data);
  let ARN = '';
  await prom.then((result) => {
    ARN = (JSON.stringify(result));
  });
  return { statusCode: 200, body: ARN };
};

export default updateFunction;
