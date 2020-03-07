import { getConfiguration, EnvType } from './configurator';
import { Gateway } from './gateway';

const fetch = require('node-fetch');
require('dotenv').config();

// Listens for eth events, calls lambda functions, returns output to etherless-cli

// configure AWS Lambda service (uses credentials from ~/.aws/credentials)
const AWS = require('aws-sdk');
// AWS.config.loadFromPath('./aws-credentials.json')
const lambda = new AWS.Lambda({ region: 'us-east-1' });

const etherescanUrl = `https://api-ropsten.etherscan.io/api?module=contract&action=getabi&address=${process.env.CONTRACT}&apikey=${process.env.ETHSCAN}`;
const gatewayConfig = EnvType.Infura;

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
          gateway.contract.methods.execRemoteResponse(jsonResponse, identifier)
            .send({ from: gateway.testAccount }).catch(console.error);
        }).catch(console.error);
      } else {
        console.error('An error occured', error);
      }
    });
  }).catch(console.error);
}

process.on('exit', () => {
  console.log('Close connection to network');
  pGateway.then((gateway:Gateway) => gateway.disconnect());
});
process.on('SIGINT', () => {
  process.exit();
});

export default runnerExecute();
