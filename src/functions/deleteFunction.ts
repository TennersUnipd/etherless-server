/**
 * @file deleteFunction.ts
 * @class FunctionDeployer
 * @methods deleteFunction
 */
import { APIGatewayProxyHandler } from 'aws-lambda';

import config from '../config.json';

import AWS = require('aws-sdk');

/**
 * @class FunctionDestroyer
 * Prepare the data and sends the delete request to the AWS service
 */
export class FunctionDestroyer {
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
  public prepareFunctionToDelete(parsedData: any): any {
    return {
      FunctionName: parsedData.ARN,
    };
  }

  /**
   * @function letFunctionDelete
   * @param data
   * parse the data and sends the delete request
   */
  public letFunctionDelete(data): Promise<any> {
    const functionSerialized = this.prepareFunctionToDelete(data);
    return new Promise((resolve, reject) => {
      this.aws.deleteFunction(functionSerialized, (err: any, rData) => {
        if (err) reject(err);
        else resolve(rData);
      });
    });
  }
}

/**
 * @function deleteFunction
 * @param event
 * Instantiate the class FunctionDestroyer and returns the result
 */
export const deleteFunction: APIGatewayProxyHandler = async (event) => {
  const deployer = new FunctionDestroyer(new AWS.Lambda({ region: config.region }));
  const data = JSON.parse(event.body);
  await deployer.letFunctionDelete(data);
  return { statusCode: 200, body: 'ok' };
};

export default deleteFunction;
