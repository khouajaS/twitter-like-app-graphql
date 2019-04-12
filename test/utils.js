const delay = ms => new Promise((resolve) => { setTimeout(() => { resolve(); }, ms); });

const retry = async (ctx, func, args, retries = 5, delayms = 500) => {
  if (retries === 0) throw Error('Failed to run');
  try {
    const res = await func.call(ctx, ...args);
    return res;
  } catch (error) {
    await delay(delayms);
    console.log('retry to connect...'); // eslint-disable-line no-console
    return retry(ctx, func, args, retries - 1, delayms * 2);
  }
};

exports.retry = retry;
