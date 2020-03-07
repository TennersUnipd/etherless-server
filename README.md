# Etherless-Smart

This is the serverless component of the Etherless project that you can find [here](https://github.com/TennersUnipd/etherless)

## Requirements
To make it work you need to install:
- [Nodejs-lts](https://nodejs.org/it/download/) (12.16.1 as today).
- Typescritp  ``` npm install -g trypesctipt@3.6 ```
- ts-node  ``` npm install -g ts-node ```
- Serverless-framework  ``` npm install -g serverless ```

## How to run it 

This component cannot work alone you need the other component of the porject Etherless.

After cloning this repository you need to install the dependencies ``` npm install --dotenv-extended```

done that you need to copy the abi file that you can find in the folder build/contracts after the command ``` truffle build ```` in contracts folder of this component.

Before running the program you must substitute the test account and the contract address in the configurator.

To start the server the command is ``` sls offline ```
    In the offline mode you can't use the create function because it can't compute the correct credential to make the deploy.

If you want to deploy to aws lambda you need to sing-up serverless server and associated the aws account, for more information reference the serverless documentation.

For the deployed version you must change the ANR_ROLE in the handler with another one made from the IAM panel in the AWS control panel.

To deploy the server to the aws lambda service ``` sls deploy ```.
In aws envoirment the runner should run under cronjob in autorun.

