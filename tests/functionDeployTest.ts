import { describe, it } from 'mocha';
import mockito from 'ts-mockito';
import { assert } from 'chai';

import * as AWSMock from 'aws-sdk-mock';
import * as AWS from 'aws-sdk';
import { GetItemInput } from 'aws-sdk/clients/dynamodb';
import AWSInstance from '../src/awsInstance';
import { FunctionDeployer } from '../src/functions/createFunction';

AWSMock.setSDKInstance(AWS);

const AdmZip = require('adm-zip');

const mockedAWS: AWSInstance = mockito.mock(AWSInstance);

describe('testing FunctionDeployer', () => {
  const fnDeployer: FunctionDeployer = new FunctionDeployer(mockito.instance(mockedAWS));

  // STUB FOR THE FILE BUFFER
  const zip = new AdmZip();
  zip.addLocalFile('./tests/dummyFunction.js');
  const zipBuffer = zip.toBuffer();

  // STUB FOR AWSInstance Methods
  mockito.when(mockedAWS.getLambda()).thenReturn(new AWS.Lambda({ region: 'us-east-1' }));
  const data = { name: 'testName', zip: zipBuffer };
  mockito.when(mockedAWS.prepareFunctionToStore(data)).thenReturn(
    {
      Code: {
        ZipFile: zipBuffer,
      },
      FunctionName: 'testName',
      Handler: 'testName.handler',
      MemorySize: 128,
      Publish: true,
      Role: 'roleString',
      Runtime: 'runTimeString',
      Timeout: 10,
      VpcConfig: {
      },
    },
  );
  it('testing uploadFunction()', () => {
    AWSMock.mock('Lambda', 'createFunction', (params: GetItemInput, callBack: Function) => {
      console.log(params);
      console.log('calledMocked');
      callBack(null, { arnFunction: 'test' });
    });
    console.log(data);
    const toLoad = mockedAWS.prepareFunctionToStore(data);
    console.log(toLoad);
    fnDeployer.uploadFunction(toLoad)
      .then((result) => { console.log(result); })
      .catch((err) => { assert.fail(err); });
  });
});
