import Runner from './src/runner/Runner';

const createFunction = require('./src/functions/createFunction');
const aliveRunner = require('./src/functions/aliveRunnerFunction');

const runner = new Runner();
runner.config();

export { aliveRunner };

export { createFunction };
