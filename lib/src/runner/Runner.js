"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Web3 = require('web3');
const axios_1 = require("axios");
const AWS = require('aws-sdk');
const lambda = new AWS.Lambda({ region: 'us-east-1' });
class Runner {
    async config() {
        const abi = await Runner.getAbi(process.env.CONTRACT_ADDRESS);
        this.web3 = new Web3(new Web3.providers.WebsocketProvider('wss://ropsten.infura.io/ws/v3/f065353f3ff14efa80c5be0cf4cc6655'));
        console.log("CONTRACT", process.env.CONTRACT_ADDRESS);
        this.contract = new this.web3.eth.Contract(abi, process.env.CONTRACT_ADDRESS);
        this.start();
    }
    static async getAbi(contractAddress) {
        try {
            console.log('DOWNLOADING contract abi');
            const response = await axios_1.default.get(`https://api-ropsten.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${process.env.ETHSCANKEY}`);
            return JSON.parse(response.data.result);
        }
        catch (error) {
            throw new Error('Unable to update contract ABI');
        }
    }
    start() {
        console.log('Starting to listen');
        let subscription = this.contract.events.RemoteExec((error, event) => {
            console.log('Event received');
            if (error == null) {
                const functionRemoteResource = event.returnValues._name;
                const functionParameters = event.returnValues._parameters;
                const identifier = event.returnValues._identifier;
                console.log(`Call to function ${functionRemoteResource} with params ${functionParameters}`);
                Runner.executeLambdaFunction(functionRemoteResource, functionParameters).then((response) => {
                    console.log(response);
                    console.log('Now giving back to etherless-cli');
                    const jsonResponse = JSON.stringify(response);
                    this.sendBackResponse(jsonResponse, identifier);
                }).catch((err) => {
                    this.sendBackResponse(JSON.stringify(err), identifier);
                });
            }
        });
        subscription.on('connected', (connected) => {
            console.log("connected", connected);
        });
        subscription.on('error', (error) => {
            console.log("ERROR", error);
        });
    }
    sendBackResponse(content, identifier) {
        const sendFn = this.contract.methods.sendResponse(content, identifier);
        this.transactContractMethod(sendFn).then(() => console.log('Response sent')).catch((er) => console.log('Can\'t send response', er));
    }
    static executeLambdaFunction(arn, params) {
        const functionDescriptor = {
            FunctionName: arn,
            Payload: params,
        };
        return lambda.invoke(functionDescriptor).promise();
    }
    static runnerEthAccount() {
        return { address: process.env.RUNNER_ACC_ADDRESS, privateKey: process.env.RUNNER_ACC_KEY };
    }
    async transactContractMethod(func, value = undefined) {
        const caller = Runner.runnerEthAccount();
        let estimatedGas = await func.estimateGas({ from: caller.address, value });
        estimatedGas = Math.round(estimatedGas * 2);
        console.log('Estimated gas', estimatedGas);
        const tx = {
            from: caller.address,
            to: this.contract.options.address,
            gas: estimatedGas,
            value,
            data: func.encodeABI(),
        };
        return new Promise((resolve, reject) => {
            const signPromise = this.web3.eth.accounts.signTransaction(tx, caller.privateKey);
            signPromise.then((signedTx) => {
                const raw = signedTx.rawTransaction;
                if (raw === undefined) {
                    throw new Error('Awesome error');
                }
                const sentTx = this.web3.eth.sendSignedTransaction(raw);
                sentTx.on('receipt', () => {
                    resolve('Request sent');
                });
                sentTx.on('error', (err) => {
                    reject(err);
                });
            }).catch(reject);
        });
    }
}
exports.default = Runner;
//# sourceMappingURL=Runner.js.map