const Task = require('data.task');
const { get } = require('lodash');

const createTask = (promise) =>
  new Task((reject, resolve) => promise.then(resolve).catch(reject));

const getContainer = (name) => (docker) =>
  createTask(docker.command('ps')).map(({ containerList }) =>
    containerList.find((cont) => cont.names === name),
  );

const stopAndRemoveContainer = (id) => (docker) =>
  createTask(docker.command(`stop ${id}`)).chain(() =>
    createTask(docker.command(`rm ${id}`)),
  );

const runMongoConatainer = (name) => (docker) =>
  createTask(docker.command(`run --name ${name} -d mongo:latest`));

const getContainerIP = (name) => (docker) =>
  getContainer(name)(docker)
    .chain((runnedMongodbContainer) =>
      createTask(
        docker.command(`inspect ${runnedMongodbContainer['container id']}`),
      ),
    )
    .map((container) =>
      get(container, ['object', '0', 'NetworkSettings', 'IPAddress']),
    );

const runNothing = () => createTask(Promise.resolve());

const log = (tag, { withoutValue = false } = {}) => (val) => {
  if (withoutValue) {
    console.log(tag);
  } else {
    console.log(tag, val);
  }
  return val;
};

exports.getContainer = getContainer;
exports.stopAndRemoveContainer = stopAndRemoveContainer;
exports.runMongoConatainer = runMongoConatainer;
exports.getContainerIP = getContainerIP;
exports.createTask = createTask;
exports.runNothing = runNothing;
exports.log = log;
