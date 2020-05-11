import { APIGatewayProxyHandler } from 'aws-lambda';
import AWSInstance from '../awsInstance';


export class FunctionUpdater {
  private aws: AWSInstance;

  constructor(aws: AWSInstance) {
    this.aws = aws;
  }

  // private static updateprepareFunctionToUpdate(parsedData: any): any {
  //   return {
  //     FunctionName: parsedData.ARN,
  //     ZipFile: Buffer.from(parsedData.zip, 'utf8'),
  //     Publish: true,
  //   };
  // }

  public letUpdateFunction(data): Promise<any> {
    const functionSerialized = this.aws.prepareFunctionToUpdate(data);
    return new Promise((resolve, reject) => {
      this.aws.getLambda().updateFunctionCode(functionSerialized, (err: any, rData) => {
        if (err) reject(err);
        else resolve(rData);
      });
    });
  }
}

export const updateFunction: APIGatewayProxyHandler = async (event) => {
  const deployer = new FunctionUpdater(new AWSInstance());
  const data = JSON.parse(event.body);
  const prom = deployer.letUpdateFunction(data);
  let ARN = '';
  await prom.then((result) => {
    ARN = (JSON.stringify(result));
  });
  return { statusCode: 200, body: ARN };
};

export default updateFunction;
