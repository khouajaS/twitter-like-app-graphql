import { gql } from 'apollo-server';

const Session = gql`
  type Session {
    id: ID!
    token: String!
    username: String!
    email: String!
  }
`;

const NewSessionResponse = gql`
  type NewSessionResponse implements MutationResponse {
    error: String
    ok: Boolean
    session: Session
  }
`;

const resolvers = {};

export default {
  typeDefs: [
    Session,
    NewSessionResponse,
  ],
  resolvers,
};
