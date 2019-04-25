const { Docker } = require('docker-cli-js');
const { cleaningDockerContainerForTest } = require('./tasks');

async function globalTeardown() {
  const mongoName = 'some-mongo';
  const docker = new Docker();

  return cleaningDockerContainerForTest(mongoName, docker).fork(
    (error) => {
      console.log(error); // eslint-disable-line no-console
      process.exit(1);
    },
    () => {
      return;
    },
  );
}

module.exports = globalTeardown;
