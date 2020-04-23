import { APIGatewayProxyHandler } from 'aws-lambda';
import AWSInstance from '../awsInstance';


export class FunctionDeployer{
  private aws:AWSInstance;

  constructor(aws:AWSInstance){
    this.aws = aws;
  }

  public letFunctionDelete(functionDefinition):Promise<any>{
    return new Promise((resolve,reject)=>{
      this.aws.getLambda().deleteFunction(functionDefinition, (err:any,rData) =>{
        if(err) reject(err);
        else resolve(rData);
      })
    });
  }
}

export const deleteFunction:APIGatewayProxyHandler = async (event) => {
  const deployer:FunctionDeployer = new FunctionDeployer(new AWSInstance());
  const data = JSON.parse(event.body);
  let functionSerialized = this.aws.prepareFunctionToDelete(data);
  const prom = deployer.letFunctionDelete(functionSerialized);
  //manca messaggio di esito positivo
  let ARN = '';
  await prom.then((result) => {
    ARN = (JSON.stringify(result));
  });
  return { statusCode: 200, body: ARN };
};

export default deleteFunction;
