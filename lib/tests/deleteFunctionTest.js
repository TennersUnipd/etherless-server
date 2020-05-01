"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deleteFunction_1 = require("../src/functions/deleteFunction");
const mocha_1 = require("mocha");
const ts_mockito_1 = require("ts-mockito");
const chai_1 = require("chai");
const awsInstance_1 = require("../src/awsInstance");
const AWSMock = require("aws-sdk-mock");
const AWS = require("aws-sdk");
AWSMock.setSDKInstance(AWS);
var AdmZip = require('adm-zip');
const mockedAWS = ts_mockito_1.default.mock(awsInstance_1.AWSInstance);
mocha_1.describe('testing FunctionDeployer', () => {
    const fnDeployer = new deleteFunction_1.FunctionDeployer(ts_mockito_1.default.instance(mockedAWS));
    const zip = new AdmZip();
    zip.addLocalFile('./tests/dummyFunction.js');
    const zipBuffer = zip.toBuffer();
    ts_mockito_1.default.when(mockedAWS.getLambda()).thenReturn(new AWS.Lambda({ region: 'us-east-1' }));
    const data = { name: 'testName', zip: zipBuffer };
    ts_mockito_1.default.when(mockedAWS.prepareFunctionToDelete(data)).thenReturn({
        FunctionName: 'testName',
    });
    mocha_1.it('testing deleteFunction()', () => {
        AWSMock.mock('Lambda', 'deleteFunction', (params, callBack) => {
            console.log(params);
            console.log('calledMocked');
            callBack(null, { arnFunction: 'test' });
        });
        console.log(data);
        const toDelete = mockedAWS.prepareFunctionToDelete(data);
        console.log(toDelete);
        fnDeployer.letFunctionDelete(toDelete)
            .then((result) => { console.log(result); })
            .catch((err) => { chai_1.assert.fail(err); });
    });
});
//# sourceMappingURL=deleteFunctionTest.js.map