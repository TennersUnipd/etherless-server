import { getConfiguration, EnvType } from './configurator';
import { Gateway } from './gateway';

require('dotenv').config();

// Listens for eth events, calls lambda functions, returns output to etherless-cli

// configure AWS Lambda service (uses credentials from ~/.aws/credentials)
const AWS = require('aws-sdk');
// AWS.config.loadFromPath('./aws-credentials.json')
const lambda = new AWS.Lambda({ region: 'us-east-1' });

const gatewayConfig = getConfiguration(EnvType.Test);
const gateway = new Gateway(gatewayConfig);

function executeLambdaFunction(arn, params) {
  const functionDescriptor = {
    FunctionName: arn,
    Payload: params,
  };
  return lambda.invoke(functionDescriptor).promise();
}

let requestsCounter = 0;
console.log('Started listening for execution requests...');
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

process.on('exit', () => {
  console.log('Close connection to network');
  gateway.disconnect();
});
process.on('SIGINT', () => {
  process.exit();
});
