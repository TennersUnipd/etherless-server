"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const awsInstance_1 = require("../awsInstance");
const AWS = new awsInstance_1.default();
exports.createFunction = async (event) => {
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
        Role: AWS.getArnRole(),
        Runtime: AWS.getRuntime(),
        Timeout: AWS.getFnTimeout(),
        VpcConfig: {},
    };
    const prom = new Promise((resolve, reject) => {
        AWS.getLambda().createFunction(functionToStore, (err, rData) => {
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
exports.default = exports.createFunction;
//# sourceMappingURL=createFunction.js.map