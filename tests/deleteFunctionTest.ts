import {FunctionDeployer} from  '../src/functions/deleteFunction'
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
    mockito.when(mockedAWS.getLambda()).thenReturn(new AWS.Lambda({ region: 'us-east-1' })); 
    const data = {name:'testName',zip:zipBuffer};
    mockito.when(mockedAWS.prepareFunctionToDelete(data)).thenReturn(
      {
        FunctionName: 'testName',
      }
    )
    it('testing deleteFunction()',()=>{
        AWSMock.mock('Lambda','deleteFunction',(params: GetItemInput, callBack: Function)=>{
            console.log(params);
            console.log('calledMocked');
            callBack(null,{arnFunction:'test'});
        });
        console.log(data);
        const toDelete = mockedAWS.prepareFunctionToDelete(data);
        console.log(toDelete);
        fnDeployer.letFunctionDelete(toDelete)
          .then((result)=>{console.log(result)})
          .catch((err)=>{assert.fail(err)});
    });
});