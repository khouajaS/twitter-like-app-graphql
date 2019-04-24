const { Docker } = require('docker-cli-js');
const { get } = require('lodash');
const {
  getContainer,
  stopAndRemoveContainer,
  runNothing,
  log,
} = require('./utils');

async function globalTeardown() {
  const mongoName = 'some-mongo';
  const docker = new Docker();

  const task = getContainer(mongoName)(docker)
    .map(log('\nstarting cleaning up', { withoutValue: true }))
    .map((mongoContainer) => get(mongoContainer, 'container id'))
    .chain((id) => (id ? stopAndRemoveContainer(id)(docker) : runNothing()))
    .map(log('\ncleaning up finished successfully', { withoutValue: true }));
  return task.fork(
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
