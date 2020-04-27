import { APIGatewayProxyHandler } from 'aws-lambda';
import AWSInstance from '../awsInstance';


export class FunctionDeployer {
  private aws: AWSInstance;

  constructor(aws: AWSInstance) {
    this.aws = aws;
  }
  public letFunctionDelete(data): Promise<any> {
    let functionSerialized = this.aws.prepareFunctionToDelete(data);
    console.log('FUNCTION SERIALED= ', functionSerialized);
    return new Promise((resolve, reject) => {
      this.aws.getLambda().deleteFunction(functionSerialized, (err: any, rData) => {
        if (err) reject(err);
        else resolve(rData);
      })
    });
  }
}

export const deleteFunction: APIGatewayProxyHandler = async (event) => {
  console.log('EVENT= ', event);
  const deployer: FunctionDeployer = new FunctionDeployer(new AWSInstance());
  const data = JSON.parse(event.body);
  console.log('DATA= ', data);
  const prom = await deployer.letFunctionDelete(data);
  return { statusCode: 200, body: prom };
};

export default deleteFunction;
