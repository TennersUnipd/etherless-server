"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const awsInstance_1 = require("../awsInstance");
class FunctionDeployer {
    constructor(aws) {
        this.aws = aws;
    }
    prepareFunctionToUpdate(parsedData) {
        return {
            FunctionName: parsedData.ARN,
            ZipFile: Buffer.from(parsedData.zip, 'utf8'),
            Publish: true,
        };
    }
    letUpdateFunction(data) {
        let functionSerialized = this.aws.prepareFunctionToUpdate(data);
        return new Promise((resolve, reject) => {
            this.aws.getLambda().updateFunctionCode(functionSerialized, (err, rData) => {
                if (err)
                    reject(err);
                else
                    resolve(rData);
            });
        });
    }
}
exports.FunctionDeployer = FunctionDeployer;
exports.updateFunction = async (event) => {
    const deployer = new FunctionDeployer(new awsInstance_1.default());
    const data = JSON.parse(event.body);
    const prom = deployer.letUpdateFunction(data);
    let ARN = '';
    await prom.then((result) => {
        ARN = (JSON.stringify(result));
    });
    return { statusCode: 200, body: ARN };
};
exports.default = exports.updateFunction;
//# sourceMappingURL=updateFunction.js.map