import { APIGatewayProxyHandler } from 'aws-lambda';
const multipart = require('aws-lambda-multipart-parser')
import 'source-map-support/register';
var AWS = require('aws-sdk');
var lambda = new AWS.Lambda({ region: 'us-east-1' })

const runtime: string = "nodejs12.x";
const ARN_ROLE: string = "arn:aws:iam::111040565648:role/LambdaDeployer";
const FN_TIMEOUT = 30;

interface retriveFunctionData {
  name: string,
  proto: JSON
}

export const createFunction: APIGatewayProxyHandler = async (event, _context) => {
  let data = multipart.parse(event);
  let ZipFile = data.zip.content;
  let dataFunction = JSON.parse(data.request.content);
  let functionToStore = {
    Code: {
      ZipFile: ZipFile
    },
    Description: dataFunction.description,
    FunctionName: dataFunction.name,
    Handler: dataFunction.name + ".handler",
    MemorySize: 128,
    Publish: true,
    Role: ARN_ROLE,
    Runtime: runtime,
    Timeout: FN_TIMEOUT,
    VpcConfig: {
    }
  };

  let prom = new Promise((resolve, reject) => {
    lambda.createFunction(functionToStore, (err: any, rData: any) => {
      if (err) reject(err);
      else resolve(rData);
    });
  })
  let response = await prom;
  console.log(prom.resolve);
  console.log(prom.reject);

  return {
    statusCode: 200,
    body: "OK"
  };
}

export const retriveFunction: APIGatewayProxyHandler = async (event, _context) => {
  let request: retriveFunctionData = JSON.parse(JSON.stringify(event)).body;
  console.log(request);
  return {
    statusCode: 200,
    body: "OK"
  };
}