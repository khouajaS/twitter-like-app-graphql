import { ApolloServer, makeExecutableSchema } from 'apollo-server';
import { get } from 'lodash';
import User from './models/user';
import Tweet from './models/tweet';
import { typeDefs, resolvers, schemaDirectives } from './schema';

const ACTIVE_PLAYGROUND = process.env.ACTIVE_PLAYGROUND || 1;

const playgroundOptions = ACTIVE_PLAYGROUND ? { introspection: true, playground: true } : {};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives,
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
});

const createApolloServer = (Accesstoken) => {
  const serverOptions = {
    schema,
    context: async ({ req }) => {
      const token = get(req, ['headers', 'x-auth']);
      const user = await User.decodeUser(token);
      return {
        user,
        models: { User, Tweet },
      };
    },
  };
  if (Accesstoken) {
    serverOptions.context = async () => {
      const user = await User.decodeUser(Accesstoken);
      return {
        user,
        models: { User, Tweet },
      };
    };
  }

  return new ApolloServer({ ...serverOptions, ...playgroundOptions });
};

export default createApolloServer;
