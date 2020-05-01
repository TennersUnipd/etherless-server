"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const updateFunction_1 = require("../src/functions/updateFunction");
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
    const fnDeployer = new updateFunction_1.FunctionDeployer(ts_mockito_1.default.instance(mockedAWS));
    const zip = new AdmZip();
    zip.addLocalFile('./tests/dummyFunction.js');
    const zipBuffer = zip.toBuffer();
    ts_mockito_1.default.when(mockedAWS.getLambda()).thenReturn(new AWS.Lambda({ region: 'us-east-1' }));
    const data = { name: 'testName', zip: zipBuffer };
    ts_mockito_1.default.when(mockedAWS.prepareFunctionToUpdate(data)).thenReturn({
        FunctionName: 'testName',
        ZipFile: zipBuffer,
        Publish: true,
    });
    mocha_1.it('testing updateFunction()', () => {
        AWSMock.mock('Lambda', 'updateFunction', (params, callBack) => {
            console.log(params);
            console.log('calledMocked');
            callBack(null, { arnFunction: 'test' });
        });
        console.log(data);
        const toUpdate = mockedAWS.prepareFunctionToDelete(data);
        console.log(toUpdate);
        fnDeployer.letUpdateFunction(toUpdate)
            .then((result) => { console.log(result); })
            .catch((err) => { chai_1.assert.fail(err); });
    });
});
//# sourceMappingURL=updateFunctionTest.js.map