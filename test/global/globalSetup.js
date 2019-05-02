const uuid = require('uuid/v4');
const { Docker } = require('docker-cli-js');
const { createDockerContainerForTest } = require('../../libs/mongodb-runner/index');

async function globalSetup() {
  const mongoName = 'mongo-' + uuid();
  const docker = new Docker();

  return createDockerContainerForTest(mongoName, docker).fork(
    (error) => {
      console.log(error); // eslint-disable-line no-console
      process.exit(1);
    },
    (IPAddress) => {
      process.IPAddress = IPAddress;
      process.mongoName = mongoName;
    },
  );
}

module.exports = globalSetup;
