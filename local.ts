import Runner from './src/runner/Runner';

// TODO: add env variable from file
process.env.ETHSCANKEY = "RKVYFCZNF8HW6MSGXFDNIV7E6Q9BZQSSTI";
process.env.CONTRACT_ADDRESS = '0x3A9C7bD822F717545DaB078e1963793fB08bE90e';
process.env.RUNNER_ACC_ADDRESS = '0x6883F8f5efA1fE30f6903A11398b19C25c5E324d';
process.env.RUNNER_ACC_KEY = '0x42941C8EDA235C0102C94793F671B2D6B68080A2CCADD5D5248DAFA5B72B94BE'; // private key

// Entry point per l'esecuzione locale
// IMPROVEMENT: get contract address as input
// IMMPROVE: get contract abi from etherless
const runner = new Runner();
runner.config();
