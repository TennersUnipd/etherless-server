import {FunctionDeployer} from  '../src/functions/createFunction'
import {describe, it} from 'mocha'
import mockito from 'ts-mockito'
import {assert} from 'chai'
import {AWSInstance} from '../src/awsInstance'

import * as AWSMock from "aws-sdk-mock";
import * as AWS from "aws-sdk"; 
import { GetItemInput } from 'aws-sdk/clients/dynamodb'

AWSMock.setSDKInstance(AWS);

var AdmZip = require('adm-zip');

const mockedAWS: AWSInstance = mockito.mock(AWSInstance);

describe('testing FunctionDeployer', () => {
    const fnDeployer: FunctionDeployer = new FunctionDeployer(mockito.instance(mockedAWS))

    // STUB FOR THE FILE BUFFER
    const zip = new AdmZip();
    zip.addLocalFile('./tests/dummyFunction.js');
    const zipBuffer = zip.toBuffer();

    // STUB FOR AWSInstance Methods
    mockito.when(mockedAWS.getArnRole()).thenReturn('roleString');
    mockito.when(mockedAWS.getRuntime()).thenReturn('runTimeString');
    mockito.when(mockedAWS.getFnTimeout()).thenReturn(10);
    mockito.when(mockedAWS.getLambda()).thenReturn(new AWS.Lambda({ region: 'us-east-1' })); 
    const data = {name:'testName',zip:zipBuffer};
    mockito.when(mockedAWS.prepareFunctionToStore(data)).thenReturn(
      {

      }
    )

    /*it('testing prepareFunctionToStore()',()=>{
        const result = fnDeployer.prepareFunctionToStore(data);
        expect(result).to.include({FunctionName:'testName'});
        expect(result).to.include({Handler:'testName.handler'});
        expect(result).to.include({Role:'roleString'});
        expect(result).to.include({Runtime:'runTimeString'});
        expect(result).to.include({Timeout:10});
    });*/
    it('testing uploadFunction()',()=>{
        AWSMock.mock('Lambda','createFunction',(params: GetItemInput, callBack: Function)=>{
            console.log(params);
            console.log('calledMocked');
            callBack(null,{arnFunction:'test'});
        });
        console.log(data);
        const toLoad = mockedAWS.prepareFunctionToStore(data);
        console.log(toLoad);
        fnDeployer.uploadFunction(toLoad)
          .then((result)=>{console.log(result)})
          .catch((err)=>{assert.fail(err)});

    });
});

/**
 * public prepareFunctionToStore(parsedData:any):any {
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
 */