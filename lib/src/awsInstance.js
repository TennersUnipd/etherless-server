"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require('aws-sdk');
class AWSInstance {
    constructor() {
        this.lambda = new AWS.Lambda({ region: 'us-east-1' });
        this.runtime = 'nodejs10.x';
        this.ARN_ROLE = 'arn:aws:iam::316315295188:role/etherless-server';
        this.FN_TIMEOUT = 60;
    }
    getLambda() {
        return this.lambda;
    }
    getRuntime() {
        return this.runtime;
    }
    getArnRole() {
        return this.ARN_ROLE;
    }
    getFnTimeout() {
        return this.FN_TIMEOUT;
    }
    prepareFunctionToUpdate(parsedData) {
        return {
            FunctionName: parsedData.ARN,
            ZipFile: Buffer.from(parsedData.zip, 'utf8'),
            Publish: true,
        };
    }
    prepareFunctionToDelete(parsedData) {
        return {
            FunctionName: parsedData.ARN,
        };
    }
    prepareFunctionToStore(parsedData) {
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
            VpcConfig: {},
        };
    }
}
exports.AWSInstance = AWSInstance;
exports.default = AWSInstance;
//# sourceMappingURL=awsInstance.js.map