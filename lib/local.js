"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Runner_1 = require("./src/runner/Runner");
process.env.ETHSCANKEY = "RKVYFCZNF8HW6MSGXFDNIV7E6Q9BZQSSTI";
process.env.CONTRACT_ADDRESS = '0x14f5aBCa0df488F9CF693B85F3ECae3FE4658F7c';
process.env.RUNNER_ACC_ADDRESS = '0xB39868E96cC950E4c8a7849189FF360070788bB2';
process.env.RUNNER_ACC_KEY = '0x4426700f288734c9756610db8738129a6a00fb739aa1b381203fdc244ea623ff ';
const runner = new Runner_1.default();
runner.config();
//# sourceMappingURL=local.js.map