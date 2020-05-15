/* eslint-disable no-underscore-dangle */
import { Contract } from 'web3-eth-contract';
import axios, { AxiosResponse } from 'axios';

import Web3 from 'web3';

// Listens for eth events, calls lambda functions, returns output to etherless-cli

// configure AWS Lambda service (uses credentials from ~/.aws/credentials)
import AWS from 'aws-sdk';

const lambda = new AWS.Lambda({ region: 'us-east-1' });

class Runner {
  private web3: any;

  private contract?: Contract;

  public async config() {
    const abi = await Runner.getAbi(process.env.CONTRACT_ADDRESS);
    this.web3 = new Web3(new Web3.providers.WebsocketProvider('wss://ropsten.infura.io/ws/v3/f065353f3ff14efa80c5be0cf4cc6655'));
    console.log('CONTRACT', process.env.CONTRACT_ADDRESS);
    this.contract = new this.web3.eth.Contract(abi, process.env.CONTRACT_ADDRESS);
    // una volta che ho instanziato il contratto
    this.start();
  }

  private static async getAbi(contractAddress: string): Promise<any> {
    try {
      console.log('DOWNLOADING contract abi');
      const response: AxiosResponse<EtherscanResponse> = await axios.get(`https://api-ropsten.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${process.env.ETHSCANKEY}`);
      return JSON.parse(response.data.result);
    } catch (error) {
      throw new Error('Unable to update contract ABI');
    }
  }

  private start() {
    console.log('Starting to listen');
    const subscription = this.contract.events.RemoteExec((error, event) => {
      console.log('Event received');
      if (error == null) {
        const functionRemoteResource = event.returnValues._name;
        const functionParameters = event.returnValues._parameters;
        const identifier = event.returnValues._identifier;

        console.log(`Call to function ${functionRemoteResource} with params ${functionParameters}`);
        Runner.executeLambdaFunction(functionRemoteResource, functionParameters)
          .then((response) => {
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
      console.log('connected', connected);
    });
    subscription.on('error', (error) => {
      console.log('ERROR', error);
    });
  }

  private sendBackResponse(content: string, identifier: string) {
    const sendFn = this.contract.methods.sendResponse(content, identifier);
    this.transactContractMethod(sendFn).then(() => console.log('Response sent')).catch((er) => console.log('Can\'t send response', er));
  }

  private static executeLambdaFunction(arn, params) {
    const functionDescriptor = {
      FunctionName: arn,
      Payload: params,
    };
    return lambda.invoke(functionDescriptor).promise();
  }

  private static runnerEthAccount(): EthAddress {
    return { address: process.env.RUNNER_ACC_ADDRESS, privateKey: process.env.RUNNER_ACC_KEY };
  }

  private async transactContractMethod(func: any, value: number | undefined = undefined): Promise<any> {
    // SERVER ETH ACCOUNT STORED SOMEWHERE ELSE
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
    return new Promise<any>((resolve, reject) => {
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

interface EtherscanResponse {
  status: string;
  message: string;
  result: string;
}

interface EthAddress {
  address: string;
  privateKey: string;
}

export default Runner;
