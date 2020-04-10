"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require('aws-sdk');
class AWSInstance {
    constructor() {
        this.lambda = new AWS.Lambda({ region: 'us-east-1' });
        this.runtime = 'nodejs10.x';
        this.ARN_ROLE = 'arn:aws:iam::964189167587:role/etherless-dev';
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
}
exports.default = AWSInstance;
//# sourceMappingURL=awsInstance.js.map