const { Docker } = require('docker-cli-js');
const { getContainer, stopAndRemoveContainer } = require('./utils');

module.exports = async function globalTeardown() {
  try {
    const docker = new Docker();
    const mongoContainer = await getContainer('some-mongo')(docker);
    if (mongoContainer) {
      await stopAndRemoveContainer(mongoContainer['container id'])(docker);
    }
  } catch (error) {
    console.log(error); // eslint-disable-line no-console
    process.exit(1);
  }
};
