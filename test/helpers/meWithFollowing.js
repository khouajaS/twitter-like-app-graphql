import { gql } from 'apollo-server';
import createApolloClient from '../createApolloClient';

const ME_WITH_FOLLOWING = gql`
  query me {
    me {
      id
      username
      following {
        count
        list {
          id
        }
      }
      followers {
        count
        list {
          id
        }
      }
    }
  }
`;

const meWithFollowing = async (accessToken) => {
  const { query } = createApolloClient(accessToken);

  const {
    data: { me },
  } = await query({
    query: ME_WITH_FOLLOWING,
  });

  return { me };
};

export default meWithFollowing;
