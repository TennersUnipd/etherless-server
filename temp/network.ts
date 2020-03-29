import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { WebsocketProvider } from 'web3-providers-ws';
import { AbiItem } from 'web3-utils';
import axios, { AxiosResponse } from 'axios';
import { Account } from 'web3-core';
import { Accounts } from 'web3-eth-accounts';
import Utils from './utils';

const fs = require('fs');


class Network {
    private contract: Contract;

    private web3: Web3;

    public static instance: Network;

    public static getInstance(): Network {
      if (!Network.instance) {
        Network.instance = new Network();
      }
      return Network.instance;
    }

    private constructor() {
      if (process.env.PROVIDER_API === undefined) {
        throw new Error('Inavalid network provider url');
      }
      if (process.env.CONTRACT_ADDRESS === undefined) {
        throw new Error('Inavalid contract address');
      }
      if (process.env.ABI_PATH === undefined) {
        throw new Error('Inavalid abi path');
      }

      // if (process.env.CONTRACT_ADDRESS !== Utils.localStorage.getItem('lastAbiAddress')) {
      //   Network.updateAbi(process.env.CONTRACT_ADDRESS, process.env.ABI_PATH);
      //   Utils.localStorage.setItem('lastAbiAddress', process.env.CONTRACT_ADDRESS);
      // }

      this.web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.PROVIDER_API));
      // this.web3.eth.accounts = new Accounts(process.env.PROVIDER_API);
      this.contract = new this.web3.eth.Contract(Network.getAbi(), process.env.CONTRACT_ADDRESS);
    }

    public static async updateAbi(contractAddress: string, destinationPath: string) {
      try {
        console.log('DOWNLOADING contract abi');
        const response: AxiosResponse<EtherscanResponse> = await axios.get(`https://api-ropsten.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${process.env.ETHSCAN}`);
        await fs.writeFileSync(destinationPath, response.data.result, { flag: 'w' });
      } catch (error) {
        throw new Error('Unable to update contract ABI');
      }
    }

    private static getAbi() : AbiItem[] {
      try {
        const parsed = JSON.parse(fs.readFileSync(process.env.ABI_PATH));
        return parsed;
      } catch (error) {
        // TODO: temporary
        return [
          {
            inputs: [],
            name: 'retreive',
            outputs: [
              {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              {
                internalType: 'uint256',
                name: 'num',
                type: 'uint256',
              },
            ],
            name: 'store',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ];
      }
    }

    disconnect() {
      if (this.web3.currentProvider !== null) {
        (this.web3.currentProvider as WebsocketProvider).disconnect(20, 'execution ended');
      }
    }

    ethPrivateKeyToAccount(key: string): Account {
      return this.web3.eth.accounts.privateKeyToAccount(key);
    }

    getContract(): Contract {
      return this.contract;
    }

    getContractMethods(): any {
      return this.contract?.methods;
    }

    accountCreate(): Account {
      return this.web3.eth.accounts.create();
    }

    private static ethNetworkCaller(): Account {
      const account = SessionManager.getInstance().user;
      if (account === undefined) {
        throw new Error('No user logged');
      }
      return account;
    }

    // eslint-disable-next-line class-methods-use-this
    callContractMethod(func: Function): Promise<any> {
      const caller = Network.ethNetworkCaller();
      return func.call({ from: caller.address });
    }

    async transactContractMethod(func: any, value: number | undefined = undefined): Promise<any> {
      const caller = Network.ethNetworkCaller();
      let estimatedGas = await func.estimateGas({ from: caller.address, value, gas: 80000290 });
      estimatedGas = Math.round(estimatedGas * 1.5);
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

    static uploadFunction(fileBuffer: string, fnName: string): Promise<any> {
      if (SessionManager.getInstance().userLogged() === false) {
        throw new Error('No user logged');
      }

      return axios.post(`${process.env.AWS_ENDPOINT}createFunction`,
        {
          zip: fileBuffer,
          name: fnName,
        }).then((response:AxiosResponse) => response.data.FunctionArn);
    }
}

interface EtherscanResponse {
  status: string;
  message: string;
  result: string;
}

export default Network;
