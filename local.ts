import Runner from './src/runner/Runner';

// TODO: add env variable from file
process.env.ETHSCANKEY = "RKVYFCZNF8HW6MSGXFDNIV7E6Q9BZQSSTI";
process.env.CONTRACT_ADDRESS = '0x6F9954E183b86B289aFe9f04E7cF60Af0c410a6B';
process.env.RUNNER_ACC_ADDRESS = '0x6Fad230E4549086a4ae0d9f740F7192962fbbc3d';
process.env.RUNNER_ACC_KEY = '0x3EB0D669840DF6DEDF5E688B1DB6D30D381F97F60650619DCC723091CBD7DF99'; // private key

// Entry point per l'esecuzione locale
// IMPROVEMENT: get contract address as input
// IMMPROVE: get contract abi from etherless
const runner = new Runner();
runner.config();
