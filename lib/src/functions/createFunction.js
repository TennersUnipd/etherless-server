"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require('aws-sdk');
const lambda = new AWS.Lambda({ region: 'us-east-1' });
const runtime = 'nodejs12.x';
const ARN_ROLE = 'arn:aws:iam::964189167587:role/etherless-dev';
const FN_TIMEOUT = 30;
const createFunction = async (event) => {
    const data = JSON.parse(event.body);
    const buffer = Buffer.from(data.zip, 'utf8');
    const functionToStore = {
        Code: {
            ZipFile: buffer,
        },
        FunctionName: data.name,
        Handler: `${data.name}.handler`,
        MemorySize: 128,
        Publish: true,
        Role: ARN_ROLE,
        Runtime: runtime,
        Timeout: FN_TIMEOUT,
        VpcConfig: {},
    };
    const prom = new Promise((resolve, reject) => {
        lambda.createFunction(functionToStore, (err, rData) => {
            if (err)
                reject(err);
            else
                resolve(rData);
        });
    });
    let ARN = '';
    await prom.then((result) => {
        ARN = (JSON.stringify(result));
    });
    return { statusCode: 200, body: ARN };
};
exports.default = createFunction;
//# sourceMappingURL=createFunction.js.map