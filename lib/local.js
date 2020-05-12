"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Runner_1 = require("./src/runner/Runner");
process.env.ETHSCANKEY = "RKVYFCZNF8HW6MSGXFDNIV7E6Q9BZQSSTI";
process.env.CONTRACT_ADDRESS = '0x7786d4CcA496C5F7C4FB379665A87F8444998fC9';
process.env.RUNNER_ACC_ADDRESS = '0xd2D1CA60a4A33Fb0a2C3Fd6e2E22822c211c414A';
process.env.RUNNER_ACC_KEY = '0xD1C0D1B70BB0B5215B6CC54CF8F872A99002476CD4BE8C013F7F7ED5BC341546';
const runner = new Runner_1.default();
runner.config();
//# sourceMappingURL=local.js.map