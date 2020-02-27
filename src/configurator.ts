import { GatewayConfiguration } from './gateway'

export enum EnvType {
    Local,
    Test,
    Stage
}
export function getConfiguration(forEnv: EnvType): GatewayConfiguration {
    switch (forEnv) {
        case EnvType.Local: return {
            providerURI: process.env.WEBSOCKET_PROVIDER ? process.env.WEBSOCKET_PROVIDER : "ws://127.0.0.1:7545",
            abiFile: "./contracts/EtherlessSmart.json",
            contractAddress: process.env.CONTRACT_ADDRESS ? process.env.CONTRACT_ADDRESS : "0x9EfbEd20Fd55012CFDbD0A4400068ce6764A95E7"
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