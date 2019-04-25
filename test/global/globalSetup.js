const { Docker } = require('docker-cli-js');
const { createDockerContainerForTest } = require('./tasks');

async function globalSetup() {
  const mongoName = 'some-mongo';
  const docker = new Docker();

  return createDockerContainerForTest(mongoName, docker).fork(
    (error) => {
      console.log(error); // eslint-disable-line no-console
      process.exit(1);
    },
    (IPAddress) => {
      process.IPAddress = IPAddress;
    },
  );
}

module.exports = globalSetup;
