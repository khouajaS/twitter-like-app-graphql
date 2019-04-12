import { gql } from 'apollo-server';

const TweetInput = gql`
  input TweetInput {
    content: String
    tags: [String]
  }
`;

const resolvers = {};

export default {
  typeDefs: [TweetInput],
  resolvers,
};
