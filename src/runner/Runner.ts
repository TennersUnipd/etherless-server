/* eslint-disable no-underscore-dangle */
import { AbiItem } from 'web3-utils';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';

const Web3 = require('web3');

require('dotenv').config();

const abi : AbiItem[] = [
  {
    inputs: [

    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: '_name',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: '_parameters',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: '_identifier',
        type: 'string',
      },
    ],
    name: 'RemoteExec',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: '_response',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: '_identifier',
        type: 'string',
      },
    ],
    name: 'RemoteResponse',
    type: 'event',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'string',
        name: 'fnName',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'description',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'prototype',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'remoteResource',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'cost',
        type: 'uint256',
      },
    ],
    name: 'createFunction',
    outputs: [

    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'string',
        name: 'fnToSearch',
        type: 'string',
      },
    ],
    name: 'findFunctions',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'description',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'prototype',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: 'cost',
            type: 'uint256',
          },
          {
            internalType: 'address payable',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'string',
            name: 'remoteResource',
            type: 'string',
          },
        ],
        internalType: 'struct Utils.Function',
        name: '',
        type: 'tuple',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [

    ],
    name: 'listFunctions',
    outputs: [
      {
        internalType: 'string[]',
        name: 'functionNames',
        type: 'string[]',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'string',
        name: 'fnName',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'paramers',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'identifier',
        type: 'string',
      },
    ],
    name: 'runFunction',
    outputs: [

    ],
    payable: true,
    stateMutability: 'payable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'string',
        name: 'result',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'identifier',
        type: 'string',
      },
    ],
    name: 'sendResponse',
    outputs: [

    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
const contractAddress = '0xbC8aa05E7B58f6fb53D197ee0028f987a4181Ab9';

// Listens for eth events, calls lambda functions, returns output to etherless-cli

// configure AWS Lambda service (uses credentials from ~/.aws/credentials)
const AWS = require('aws-sdk');
// AWS.config.loadFromPath('./aws-credentials.json')
const lambda = new AWS.Lambda({ region: 'us-east-1' });

// rewrew
// rew
// wer
// rew
// rew

// erew
// e
// rwerw

class Runner {
  web3?: Web3;

  contract?: Contract;


  config() {
    // TODO: get abi from ethersca
    const abi = await getAbi();
    this.web3 = new Web3('wss://ropsten.infura.io/ws/v3/f065353f3ff14efa80c5be0cf4cc6655');
    //
    this.contract = new Web3.eth.Contract(abi, contractAddress);
    // una volta che ho instanziato il contratto
    this.start();
  }

  public static async getAbi(contractAddress: string, destinationPath: string): Promise<any> {
    try {
      console.log('DOWNLOADING contract abi');
      const response: AxiosResponse<EtherscanResponse> = await axios.get(`https://api-ropsten.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${process.env.ETHSCAN}`);
      return response.data.result;
    } catch (error) {
      throw new Error('Unable to update contract ABI');
    }
  }

  start() {
    console.log('Starting to listen');
    this.contract.events.RemoteExec((error, event) => {
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
          const sendFn = this.contract.methods.sendResponse(jsonResponse, identifier);
          transactContractMethod(sendFn).then(() => console.log('Response sent')).catch((er) => console.log('Can\'t send responseo', er));
        }).catch(console.error);
      }
    });
  }

  static executeLambdaFunction(arn, params) {
    const functionDescriptor = {
      FunctionName: arn,
      Payload: params,
    };
    return lambda.invoke(functionDescriptor).promise();
  }

  async transactContractMethod(func: any, value: number | undefined = undefined): Promise<any> {
    // SERVER ETH ACCOUNT STORED SOMEWHERE ELSE
    const caller = { address: '0x6Fad230E4549086a4ae0d9f740F7192962fbbc3d', privateKey: '0x3EB0D669840DF6DEDF5E688B1DB6D30D381F97F60650619DCC723091CBD7DF99' };
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

export default Runner;
