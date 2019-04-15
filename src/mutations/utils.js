const buildSuccessMuationResponse = (extraFields = {}) => ({
  ok: true,
  error: null,
  ...extraFields,
});

const buildFailedMutationResponse = error => ({ ok: false, error });

const tryCatchAsyncMutation = (mutation, { anonymous } = {}) => async (root, args, ctx, info) => {
  if (anonymous && ctx.user) {
    return buildFailedMutationResponse('Already connected');
  }
  try {
    const response = await mutation(root, args, ctx, info);
    return response;
  } catch (error) {
    return buildFailedMutationResponse(error.toString());
  }
};

export {
  buildSuccessMuationResponse,
  buildFailedMutationResponse,
  tryCatchAsyncMutation,
};
