import { gql } from 'apollo-server';
import createApolloClient from '../createApolloClient';

const ME_WITH_AVATAR = gql`
  query me {
    me {
      id
      username
      avatar {
        big {
          url
        }
        meduim {
          url
        }
        small {
          url
        }
      }
    }
  }
`;

const meWithAvatarQuery = async (accessToken) => {
  const { query } = createApolloClient(accessToken);
  const {
    data: { me },
  } = await query({
    query: ME_WITH_AVATAR,
  });

  return { me };
};

export default meWithAvatarQuery;
