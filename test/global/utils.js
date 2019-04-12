const getContainer = name => async (docker) => {
  const { containerList } = await docker.command('ps');
  return containerList.find(cont => cont.names === name);
};

const stopAndRemoveContainer = id => async (docker) => {
  await docker.command(`stop ${id}`);
  await docker.command(`rm ${id}`);
};

const runMongoConatainer = name => async (docker) => {
  await docker.command(`run --name ${name} -d mongo:latest`);
};

const getContainerIP = name => async (docker) => {
  const runnedMongodbContainer = await getContainer(name)(docker);
  const {
    object: [{
      NetworkSettings: { IPAddress },
    }],
  } = await docker.command(`inspect ${runnedMongodbContainer['container id']}`);
  return IPAddress;
};

exports.getContainer = getContainer;
exports.stopAndRemoveContainer = stopAndRemoveContainer;
exports.runMongoConatainer = runMongoConatainer;
exports.getContainerIP = getContainerIP;
