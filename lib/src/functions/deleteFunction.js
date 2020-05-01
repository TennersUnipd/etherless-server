"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const awsInstance_1 = require("../awsInstance");
class FunctionDeployer {
    constructor(aws) {
        this.aws = aws;
    }
    letFunctionDelete(data) {
        let functionSerialized = this.aws.prepareFunctionToDelete(data);
        return new Promise((resolve, reject) => {
            this.aws.getLambda().deleteFunction(functionSerialized, (err, rData) => {
                if (err)
                    reject(err);
                else
                    resolve(rData);
            });
        });
    }
}
exports.FunctionDeployer = FunctionDeployer;
exports.deleteFunction = async (event) => {
    console.log('EVENT= ', event);
    const deployer = new FunctionDeployer(new awsInstance_1.default());
    const data = JSON.parse(event.body);
    console.log('DATA= ', data);
    await deployer.letFunctionDelete(data);
    return { statusCode: 200, body: 'ok' };
};
exports.default = exports.deleteFunction;
//# sourceMappingURL=deleteFunction.js.map