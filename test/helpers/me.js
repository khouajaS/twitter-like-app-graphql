import { gql } from 'apollo-server';
import createApolloClient from '../createApolloClient';

const ME = gql`
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
      blocked {
        count
        list {
          id
        }
      }
      tweets {
        id
        content
        tags {
          id
        }
        likes {
          count
          list {
            id
          }
        }
      }
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

const meQuery = async (accessToken) => {
  const { query } = createApolloClient(accessToken);
  const {
    data: { me },
  } = await query({
    query: ME,
  });

  return { me };
};

export default meQuery;
