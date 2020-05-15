import 'mocha';
import { assert } from 'chai';
import AdmZip from 'adm-zip';
import * as AWSMock from 'aws-sdk-mock';
import * as AWS from 'aws-sdk';
import { FunctionDestroyer } from '../src/functions/deleteFunction';

describe('testing FunctionDestroyer', () => {
  it('should test FunctionDestroyer', () => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('Lambda', 'deleteFunction', (params: any, callback: Function) => {
      assert.equal(params.FunctionName, 'testName', 'Name test doesn\'t match');
      assert.isFunction(callback);
      callback(0, 'result');
    });
    const fnDeployer = new FunctionDestroyer(new AWS.Lambda({ region: 'us-east-1' }));

    // STUB FOR THE FILE BUFFER
    const zip = new AdmZip();
    zip.addLocalFile('./tests/dummyFunction.js');
    const zipBuffer = zip.toBuffer();
    // STUB FOR AWSInstance Methods
    const data = { ARN: 'testName' };
    fnDeployer.letFunctionDelete(data)
      .then((result) => { assert.isOk(result); })
      .catch((err) => { assert.fail(err); });
  });
});
