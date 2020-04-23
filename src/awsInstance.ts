const AWS = require('aws-sdk');

export class AWSInstance{
    private lambda;
    private runtime:string;
    private ARN_ROLE: string;
    private FN_TIMEOUT:number; //in seconds

    constructor(){
        this.lambda = new AWS.Lambda({ region: 'us-east-1' });
        this.runtime = 'nodejs10.x';
        this.ARN_ROLE = 'arn:aws:iam::964189167587:role/etherless-dev';
        this.FN_TIMEOUT = 60;
    }

    getLambda ():any{
        return this.lambda;
    }

    getRuntime ():string{
        return this.runtime;
    }

    getArnRole ():string{
        return this.ARN_ROLE;
    }

    getFnTimeout ():number{
        return this.FN_TIMEOUT;
    }
    public prepareFunctionToUpdate(parsedData:any):any {
        return {
           FunctionName: parsedData.ARN,
           ZipFile: Buffer.from(parsedData.zip, 'utf8'),
           Publish: true,
        }
    }
    public prepareFunctionToDelete(parsedData:any):any {
        return {
           FunctionName: parsedData.ARN,
        }
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
           Role: this.getArnRole(),
           Runtime: this.getRuntime(),
           Timeout: this.getFnTimeout(),
           VpcConfig: {
           },
         }
       }
     
}

export default AWSInstance ;

// const lambda = new AWS.Lambda({ region: 'us-east-1' });


// const runtime: string = 'nodejs12.x';
// const ARN_ROLE: string = 'arn:aws:iam::964189167587:role/etherless-dev';
// const FN_TIMEOUT = 30;