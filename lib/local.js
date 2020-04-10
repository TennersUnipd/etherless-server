"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Runner_1 = require("./src/runner/Runner");
process.env.ETHSCANKEY = "RKVYFCZNF8HW6MSGXFDNIV7E6Q9BZQSSTI";
process.env.CONTRACT_ADDRESS = '0x95680eaFB76c1CcEBfDC90Ba34C4b6D56adeCCA7';
process.env.RUNNER_ACC_ADDRESS = '0x6Fad230E4549086a4ae0d9f740F7192962fbbc3d';
process.env.RUNNER_ACC_KEY = '0x3EB0D669840DF6DEDF5E688B1DB6D30D381F97F60650619DCC723091CBD7DF99';
const runner = new Runner_1.default();
runner.config();
//# sourceMappingURL=local.js.map