import { range } from 'lodash';
import createUserMutation from './createUser';

const createMultipleUsersMutation = (count) =>
  Promise.all(range(count).map(() => createUserMutation()));

export default createMultipleUsersMutation;
