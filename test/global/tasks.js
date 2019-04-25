const { get } = require('lodash');
const {
  getContainer,
  stopAndRemoveContainer,
  runMongoConatainer,
  getContainerIP,
  createTask,
  runNothing,
  log,
  tap,
} = require('./utils');

const createDockerContainerForTest = (mongoName, docker) =>
  createTask(docker.command('pull mongo'))
    .map(tap('\nmongodb image pulled'))
    .chain(() => getContainer(mongoName)(docker))
    .map((mongoContainer) => get(mongoContainer, 'container id'))
    .chain((id) => (id ? stopAndRemoveContainer(id)(docker) : runNothing()))
    .map(tap('\ncleaning mongodb containers'))
    .chain(() => runMongoConatainer(mongoName)(docker))
    .map(tap('\nrunning new instance mongodb'))
    .chain(() => getContainerIP(mongoName)(docker))
    .map(log('\nmongodb instance running with ip: '));

const cleaningDockerContainerForTest = (mongoName, docker) =>
  getContainer(mongoName)(docker)
    .map(tap('\nstarting cleaning up'))
    .map((mongoContainer) => get(mongoContainer, 'container id'))
    .chain((id) => (id ? stopAndRemoveContainer(id)(docker) : runNothing()))
    .map(tap('\ncleaning up finished successfully'));

exports.createDockerContainerForTest = createDockerContainerForTest;
exports.cleaningDockerContainerForTest = cleaningDockerContainerForTest;
