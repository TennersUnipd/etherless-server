import { APIGatewayProxyHandler } from 'aws-lambda';
import AWSInstance from '../awsInstance';


export class FunctionDeployer{
  private aws:AWSInstance;

  constructor(aws:AWSInstance){
    this.aws = aws;
  }

  public prepareFunctionToStore(parsedData:any):any {
   return {
      Code: {
        ZipFile: Buffer.from(parsedData.zip, 'utf8'),
      },
      FunctionName: parsedData.name,
      Handler: `${parsedData.name}.handler`,
      MemorySize: 128,
      Publish: true,
      Role: this.aws.getArnRole(),
      Runtime: this.aws.getRuntime(),
      Timeout: this.aws.getFnTimeout(),
      VpcConfig: {
      },
    }
  }

  public uploadFunction(functionDefinition):Promise<any>{
    return new Promise((resolve,reject)=>{
      this.aws.getLambda().createFunction(functionDefinition, (err:any,rData) =>{
        if(err) reject(err);
        else resolve(rData);
      })
    });
  }
}

export const createFunction:APIGatewayProxyHandler = async (event) => {
  const deployer:FunctionDeployer = new FunctionDeployer(new AWSInstance());
  const data = JSON.parse(event.body);
  let functionSerialized = deployer.prepareFunctionToStore(data);
  
  const prom = deployer.uploadFunction(functionSerialized);

  let ARN = '';
  await prom.then((result) => {
    ARN = (JSON.stringify(result));
  });
  return { statusCode: 200, body: ARN };
};

export default createFunction;
