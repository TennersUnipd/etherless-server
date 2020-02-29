import { GatewayConfiguration } from './gateway'

export enum EnvType {
    Local,
    Test,
    Stage
}
export function getConfiguration(forEnv: EnvType): GatewayConfiguration {
    switch (forEnv) {
        case EnvType.Local: return {
            providerURI: process.env.WEBSOCKET_PROVIDER ? process.env.WEBSOCKET_PROVIDER : "ws://taverna.pettinato.eu:7545",
            abiFile: "./contracts/EtherlessSmart.json",
            contractAddress: process.env.CONTRACT_ADDRESS ? process.env.CONTRACT_ADDRESS : "0xFa34Ae983f823C5e95c9A2E0ec164F1813F187d7"
        }
        case EnvType.Test: return {
            providerURI: process.env.WEBSOCKET_PROVIDER ? process.env.WEBSOCKET_PROVIDER : "",
            abiFile: "./contracts/EtherlessSmart.json",
            contractAddress: process.env.CONTRACT_ADDRESS ? process.env.CONTRACT_ADDRESS : ""
        }
        case EnvType.Stage: return {
            providerURI: process.env.WEBSOCKET_PROVIDER ? process.env.WEBSOCKET_PROVIDER : "",
            abiFile: "./contracts/EtherlessSmart.json",
            contractAddress: process.env.WEBSOCKET_PROVIDER ? process.env.WEBSOCKET_PROVIDER : "",
        }
    }
}