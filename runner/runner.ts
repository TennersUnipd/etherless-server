import { getConfiguration, EnvType } from './configurator';
import { Gateway } from './gateway';

const fetch = require('node-fetch');
require('dotenv').config();

// Listens for eth events, calls lambda functions, returns output to etherless-cli

// configure AWS Lambda service (uses credentials from ~/.aws/credentials)
const AWS = require('aws-sdk');
// AWS.config.loadFromPath('./aws-credentials.json')
const lambda = new AWS.Lambda({ region: 'us-east-1' });

const gatewayConfig = getConfiguration(EnvType.Local);
const gateway = new Gateway(gatewayConfig);

const getAbi = async ():Promise<JSON> => {
  const resp = await fetch(etherescanUrl);
  const respJSON = await resp.json();
  const contractABIString = await respJSON.result;
  const contractABIObj:JSON = JSON.parse(contractABIString);
  return contractABIObj;
};

const getGate = async (env: EnvType):Promise<Gateway> => {
  const config = getConfiguration(env);
  if (env === EnvType.Infura) {
    return Gateway.build(config, getAbi());
  }
  return Gateway.build(config);
};

const pGateway = getGate(gatewayConfig);

function executeLambdaFunction(arn, params) {
  const functionDescriptor = {
    FunctionName: arn,
    Payload: params,
  };
  return lambda.invoke(functionDescriptor).promise();
}

export function runnerExecute() {
  let requestsCounter = 0;
  console.log('Started listening for execution requests...');
  pGateway.then((gateway:Gateway) => {
    gateway.contract.events.RemoteExec((error, event) => {
      console.log(`Received request #${++requestsCounter}`);
      if (error == null) {
        // get data from event
        const functionRemoteResource = event.returnValues._name;
        const functionParameters = event.returnValues._parameters;
        const identifier = event.returnValues._identifier;
        // TODO: check prev values content

    console.log(`Call to function ${functionRemoteResource} with params ${functionParameters}`);
    executeLambdaFunction(functionRemoteResource, functionParameters).then((response) => {
      console.log(response);
      console.log('Now giving back to etherless-cli');
      const jsonResponse = JSON.stringify(response);
      const sendFn = gateway.contract.methods.sendResponse(jsonResponse, identifier);
      transactContractMethod(sendFn).then(() => console.log('Response sent')).catch((error) => console.log('Can\'t send responseo', error));
    }).catch(console.error);
  } else {
    console.error('An error occured', error);
  }
});

async function transactContractMethod(func: any, value: number | undefined = undefined): Promise<any>  {
  const caller = {"address":"0x6Fad230E4549086a4ae0d9f740F7192962fbbc3d","privateKey":"0x3EB0D669840DF6DEDF5E688B1DB6D30D381F97F60650619DCC723091CBD7DF99"};
  let estimatedGas = await func.estimateGas({ from: caller.address, value });
  estimatedGas=Math.round(estimatedGas*2);
  console.log("Estimated gas", estimatedGas);
  const tx = {
    from: caller.address,
    to: gateway.contract.options.address,
    gas: estimatedGas,
    value,
    data: func.encodeABI(),
  };
  return new Promise<any>((resolve, reject) => {
    const signPromise = gateway.web3.eth.accounts.signTransaction(tx, caller.privateKey);
    signPromise.then((signedTx) => {
      const raw = signedTx.rawTransaction;
      if (raw === undefined) {
        throw new Error('Awesome error');
      }
      const sentTx = gateway.web3.eth.sendSignedTransaction(raw);
      sentTx.on('receipt', () => {
        resolve('Request sent');
      });
      sentTx.on('error', (err) => {
        reject(err);
      });
    }).catch(reject);
  });
};

process.on('exit', () => {
  console.log('Close connection to network');
  pGateway.then((gateway:Gateway) => gateway.disconnect());
});
process.on('SIGINT', () => {
  process.exit();
});
  

export default runnerExecute();
