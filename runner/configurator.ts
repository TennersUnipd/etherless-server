import { GatewayConfiguration } from './gateway';

export enum EnvType {
    Local,
    Test,
    Stage
}
export function getConfiguration(forEnv: EnvType): GatewayConfiguration {
  switch (forEnv) {
    case EnvType.Local: return {
      serverlessEndpoint: 'https://sbx2aeqyl9.execute-api.us-east-1.amazonaws.com/dev/',
      providerURI: 'ws://localhost:8545',
      abiFile: './contracts/EtherlessSmart.json',
      contractAddress: '0x94DFF8Fce5D7e703Dc50FC03a990f3F4438017Fe',
      testAccount: '0x491E061Dd3097De2FD7428f553228D13fA38308F',
    };
    case EnvType.Test: return {
      serverlessEndpoint: 'https://sbx2aeqyl9.execute-api.us-east-1.amazonaws.com/dev/',
      providerURI: 'ws://taverna.pettinato.eu:8545',
      abiFile: './contracts/EtherlessSmart.json',
      contractAddress: '0xE7dB58b1dCd957CAbF09B0a467bfa1945039E367',
      testAccount: '0xA4B0e469C5fBc6d8D421d90Aa98EE5602E935239',
    };
    case EnvType.Stage: return {
      serverlessEndpoint: 'https://sbx2aeqyl9.execute-api.us-east-1.amazonaws.com/dev/',
      providerURI: 'ws://localhost:8545',
      abiFile: './contracts/EtherlessSmart.json',
      contractAddress: '0xae6755b69ccF788F3Ca306C0a7Fef75Ba6730Aa7',
      testAccount: '0x491E061Dd3097De2FD7428f553228D13fA38308F',
    };
    default: throw new Error('Undefined environment');
  }
}
