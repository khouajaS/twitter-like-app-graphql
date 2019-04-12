const buildSuccessMuationResponse = (extraFields = {}) => ({
  ok: true,
  error: null,
  ...extraFields,
});

const buildFailedMutationResponse = error => ({ ok: false, error });

const tryCatchAsyncMutation = mutation => async (root, args, ctx, info) => {
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
