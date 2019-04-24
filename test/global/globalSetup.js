const { Docker } = require('docker-cli-js');
const { get } = require('lodash');
const {
  getContainer,
  stopAndRemoveContainer,
  runMongoConatainer,
  getContainerIP,
  createTask,
  runNothing,
  log,
} = require('./utils');

async function globalSetup() {
  const mongoName = 'some-mongo';
  const docker = new Docker();

  const task = createTask(docker.command('pull mongo'))
    .map(log('\nmongodb image pulled', { withoutValue: true }))
    .chain(() => getContainer(mongoName)(docker))
    .map((mongoContainer) => get(mongoContainer, 'container id'))
    .chain((id) => (id ? stopAndRemoveContainer(id)(docker) : runNothing()))
    .map(log('\ncleaning mongodb containers', { withoutValue: true }))
    .chain(() => runMongoConatainer(mongoName)(docker))
    .map(log('\nrunning new instance mongodb', { withoutValue: true }))
    .chain(() => getContainerIP(mongoName)(docker))
    .map(log('\nmongodb instance running with ip: '));

  return task.fork(
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
