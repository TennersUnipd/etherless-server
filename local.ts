import Runner from './src/runner/Runner';

// TODO: add env variable from file
process.env.ETHSCANKEY = "RKVYFCZNF8HW6MSGXFDNIV7E6Q9BZQSSTI";
process.env.CONTRACT_ADDRESS = '0x14f5aBCa0df488F9CF693B85F3ECae3FE4658F7c';
process.env.RUNNER_ACC_ADDRESS = '0xB39868E96cC950E4c8a7849189FF360070788bB2';
process.env.RUNNER_ACC_KEY = '0x4426700f288734c9756610db8738129a6a00fb739aa1b381203fdc244ea623ff '; // private key

// Entry point per l'esecuzione locale
// IMPROVEMENT: get contract address as input
// IMMPROVE: get contract abi from etherless
const runner = new Runner();
runner.config();
