const buildSuccessMutationResponse = (extraFields = {}) => ({
  ok: true,
  error: null,
  ...extraFields,
});

const buildFailedMutationResponse = (error) => ({ ok: false, error });

const isMongodbDuplicationError = (error) => error.name === 'MongoError' && error.code === 11000;

const mongoDUplicationError = ({ errmsg }) => {
  const [, reason, field, , value] = errmsg.split(':');
  const formatedReason = reason.split('.')[1].split(' ')[0];
  const formatedField = field.split(' ')[1].split('_')[0];
  const formatedValue = value.replace(' }', '');

  return `duplication on ${formatedReason} : ${formatedField} -> ${formatedValue}`;
};

const tryCatchAsyncMutation = (mutation, { anonymous } = {}) => async (root, args, ctx, info) => {
  if (anonymous && ctx.user) {
    return buildFailedMutationResponse('Already connected');
  }
  try {
    const response = await mutation(root, args, ctx, info);
    return response;
  } catch (error) {
    if (isMongodbDuplicationError(error)) {
      return buildFailedMutationResponse(mongoDUplicationError(error));
    } else {
      return buildFailedMutationResponse(error.toString());
    }
  }
};

export { buildSuccessMutationResponse, buildFailedMutationResponse, tryCatchAsyncMutation };
