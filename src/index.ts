require('dotenv').config()
import { Gateway } from "./gateway"
import { getConfiguration, EnvType } from "./configurator"

// Listens for eth events, calls lambda functions, returns output to etherless-cli

// configure AWS Lambda service (uses credentials from ~/.aws/credentials)
var AWS = require('aws-sdk')

AWS.config.loadFromPath('./aws-credentials.json')
var lambda = new AWS.Lambda({ region: 'us-east-1' })

var randomAccount =  '0x168Ee53e8D369a4e4963Ed4F691dF2Cadd3af75d';

let gatewayConfig = getConfiguration(EnvType.Local)
let gateway = new Gateway(gatewayConfig)

var requestsCounter = 0;
console.log("Started listening for execution requests...");
gateway.contract.events.RemoteExec(function (error, event){
    console.log("Received request #"+(++requestsCounter))
    if (error == null) {
        // get data from event
        let functionRemoteResource = event.returnValues["_name"];
        let functionParameters = event.returnValues["_parameters"];
        // TODO: check prev values content

        console.log("Call to function " + functionRemoteResource + " with params "+ functionParameters);
        executeLambdaFunction(functionRemoteResource, functionParameters).then((response) => {
            console.log(response);
            console.log("Now giving back to etherless-cli");
            let jsonResponse = JSON.stringify(response);
            gateway.contract.methods.execRemoteResponse(jsonResponse).send({from: randomAccount});
        }).catch(console.error)
    } else {
        console.error("An error occured", error);
    }
});

function executeLambdaFunction(arn, params) {
    var functionDescriptor = {
        FunctionName: arn,
        Payload: params
       };
    return lambda.invoke(functionDescriptor).promise();
}

process.on("exit", function(){
    console.log("Close connection to network")
    gateway.disconnect()
})
process.on('SIGINT', function () {
    process.exit()
})