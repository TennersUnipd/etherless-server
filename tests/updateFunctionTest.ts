import { describe, it } from 'mocha';
import mockito from 'ts-mockito';
import { assert } from 'chai';

import * as AWSMock from 'aws-sdk-mock';
import * as AWS from 'aws-sdk';
import { GetItemInput } from 'aws-sdk/clients/dynamodb';
import AWSInstance from '../src/awsInstance';
import { FunctionUpdater } from '../src/functions/updateFunction';

AWSMock.setSDKInstance(AWS);

const AdmZip = require('adm-zip');

const mockedAWS: AWSInstance = mockito.mock(AWSInstance);

describe('testing FunctionDeployer', () => {
  const fnDeployer = new FunctionUpdater(mockito.instance(mockedAWS));

  // STUB FOR THE FILE BUFFER
  const zip = new AdmZip();
  zip.addLocalFile('./tests/dummyFunction.js');
  const zipBuffer = zip.toBuffer();

  // STUB FOR AWSInstance Methods
  mockito.when(mockedAWS.getLambda()).thenReturn(new AWS.Lambda({ region: 'us-east-1' }));
  const data = { name: 'testName', zip: zipBuffer };
  mockito.when(mockedAWS.prepareFunctionToUpdate(data)).thenReturn(
    {
      FunctionName: 'testName',
      ZipFile: zipBuffer,
      Publish: true,
    },
  );
  it('testing updateFunction()', () => {
    AWSMock.mock('Lambda', 'updateFunction', (params: GetItemInput, callBack: Function) => {
      console.log('calledMocked');
      callBack(null, { arnFunction: 'test' });
    });
    const toUpdate = mockedAWS.prepareFunctionToDelete(data);
    fnDeployer.letUpdateFunction(toUpdate)
      .then((result) => { assert.ok(result); })
      .catch((err) => { assert.fail(err); });
  });
});
