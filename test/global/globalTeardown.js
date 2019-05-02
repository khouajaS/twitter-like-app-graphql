const { Docker } = require('docker-cli-js');
const { cleaningDockerContainerForTest } = require('../../libs/mongodb-runner/index');

async function globalTeardown() {
  const mongoName = process.mongoName;
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
