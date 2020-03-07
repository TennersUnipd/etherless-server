const Web3 = require('web3');

export interface GatewayConfiguration {
    providerURI: string;
    abiFile: JSON;
    contractAddress: string;
    serverlessEndpoint: string;
    testAccount: string;
}

export class Gateway {
    // properties
    web3: any;

    abi: any;

    contractAddress: string = '';

    contract: any;

    gasLimit: number = 3000000;

    serverlessEndpoint: string = '';

    testAccount: string = '';

    static async build(config: GatewayConfiguration, remoteAbi?:Promise<JSON>):Promise<Gateway> {
      const toBeReturned = new Gateway();
      // connect to eth network
      toBeReturned.web3 = new Web3(new Web3.providers.WebsocketProvider(config.providerURI));
      // contract descriptor
      if (remoteAbi === null) {
        toBeReturned.abi = config.abiFile;
      } else {
        toBeReturned.abi = await remoteAbi;
      }
      toBeReturned.contractAddress = config.contractAddress;
      toBeReturned.serverlessEndpoint = config.serverlessEndpoint;
      toBeReturned.contract = new toBeReturned
        .web3.eth.Contract(toBeReturned.abi, toBeReturned.contractAddress);
      toBeReturned.testAccount = config.testAccount;
      return toBeReturned;
    }

    public setProvider(provider: any) {
      this.web3 = new Web3(provider.WebsocketProvider);
    }

    public disconnect() {
      this.web3.currentProvider.connection.close();
    }
}
