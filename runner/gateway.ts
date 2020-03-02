const Web3 = require('web3');
const fs = require('fs');

export interface GatewayConfiguration {
    providerURI: string;
    abiFile: string;
    contractAddress: string;
    serverlessEndpoint: string;
    testAccount: string;
}

export class Gateway {
    // properties
    web3: any;

    abi: any;

    contractAddress: string;

    contract: any;

    gasLimit: number = 3000000;

    serverlessEndpoint: string;

    testAccount: string;

    constructor(config: GatewayConfiguration) {
      // connect to eth network
      this.web3 = new Web3(new Web3.providers.WebsocketProvider(config.providerURI));
      // contract descriptor
      this.abi = this.getABI(config.abiFile);
      this.contractAddress = config.contractAddress;
      this.serverlessEndpoint = config.serverlessEndpoint;
      this.contract = new this.web3.eth.Contract(this.abi, this.contractAddress);
      this.testAccount = config.testAccount;
    }

    public setProvider(provider: any) {
      this.web3 = new Web3(provider.WebsocketProvider);
    }

    private getABI(abiPath: string): any {
      const parsed = JSON.parse(fs.readFileSync(abiPath));
      return parsed.abi;
      this.web3.d;
    }

    public disconnect() {
      this.web3.currentProvider.connection.close();
    }
}
