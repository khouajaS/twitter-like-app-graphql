const { Docker } = require('docker-cli-js');
const {
  getContainer,
  stopAndRemoveContainer,
  runMongoConatainer,
  getContainerIP,
} = require('./utils');

module.exports = async function globalSetup() {
  try {
    const docker = new Docker();

    await docker.command('pull mongo');
    const mongoContainer = await getContainer('some-mongo')(docker);
    if (mongoContainer) {
      await stopAndRemoveContainer(mongoContainer['container id'])(docker);
    }
    await runMongoConatainer('some-mongo')(docker);
    const IPAddress = await getContainerIP('some-mongo')(docker);
    process.IPAddress = IPAddress;
  } catch (error) {
    console.log(error); // eslint-disable-line no-console
    process.exit(1);
  }
};
