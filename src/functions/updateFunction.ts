import { APIGatewayProxyHandler } from 'aws-lambda';
import AWSInstance from '../awsInstance';


export class FunctionDeployer {
  private aws: AWSInstance;

  constructor(aws: AWSInstance) {
    this.aws = aws;
  }

  public prepareFunctionToUpdate(parsedData: any): any {
    return {
      FunctionName: parsedData.ARN,
      ZipFile: Buffer.from(parsedData.zip, 'utf8'),
      Publish: true,
    }
  }

  public letUpdateFunction(data): Promise<any> {
    let functionSerialized = this.aws.prepareFunctionToUpdate(data);
    return new Promise((resolve, reject) => {

      this.aws.getLambda().updateFunctionCode(functionSerialized, (err: any, rData) => {
        if (err) reject(err);
        else resolve(rData);
      })
    });
  }
}

export const updateFunction: APIGatewayProxyHandler = async (event) => {
  const deployer: FunctionDeployer = new FunctionDeployer(new AWSInstance());
  const data = JSON.parse(event.body);
  let functionSerialized = this.aws.prepareFunctionToUpdate(data);
  const prom = deployer.letUpdateFunction(functionSerialized);
  let ARN = '';
  await prom.then((result) => {
    ARN = (JSON.stringify(result));
  });
  return { statusCode: 200, body: ARN };
};

export default createFunction;
