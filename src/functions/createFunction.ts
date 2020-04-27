import { APIGatewayProxyHandler } from 'aws-lambda';
import AWSInstance from '../awsInstance';


export class FunctionDeployer{
  private aws:AWSInstance;

  constructor(aws:AWSInstance){
    this.aws = aws;
  }

  public uploadFunction(data):Promise<any>{
    let functionSerialized = this.aws.prepareFunctionToStore(data);
    return new Promise((resolve,reject)=>{
      this.aws.getLambda().createFunction(functionSerialized, (err:any,rData) =>{
        if(err) reject(err);
        else resolve(rData);
      })
    });
  }
}

export const createFunction:APIGatewayProxyHandler = async (event) => {
  const deployer:FunctionDeployer = new FunctionDeployer(new AWSInstance());
  const data = JSON.parse(event.body);
  
  const prom = deployer.uploadFunction(data);

  let ARN = '';
  await prom.then((result) => {
    ARN = (JSON.stringify(result));
  });
  return { statusCode: 200, body: ARN };
};

export default createFunction;
