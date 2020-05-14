import 'mocha';
import { assert } from 'chai';
import AdmZip from 'adm-zip';
import * as AWSMock from 'aws-sdk-mock';
import * as AWS from 'aws-sdk';
import { FunctionDeployer } from '../src/functions/createFunction';

describe('testing FunctionDeployer', () => {
  it('should test FunctionDeployer', () => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('Lambda', 'createFunction', (params: any, callback: Function) => {
      assert.equal(params.FunctionName, 'testName', 'Name test doesn\'t match');
      assert.isFunction(callback);
      callback(true, 'result');
    });
    const fnDeployer = new FunctionDeployer(new AWS.Lambda({ region: 'us-east-1' }));

    // STUB FOR THE FILE BUFFER
    const zip = new AdmZip();
    zip.addLocalFile('./tests/dummyFunction.js');
    const zipBuffer = zip.toBuffer();
    // STUB FOR AWSInstance Methods
    const data = { name: 'testName', zip: zipBuffer };
    fnDeployer.uploadFunction(data)
      .then((result) => { assert.isOk(result); })
      .catch((err) => { assert.fail(err); });
  });
});
