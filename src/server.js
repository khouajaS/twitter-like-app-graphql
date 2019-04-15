import { ApolloServer } from 'apollo-server';
import { get } from 'lodash';
import User from './models/user';
import Tweet from './models/tweet';
import { typeDefs, resolvers, schemaDirectives } from './schema';


const createApolloServer = (Accesstoken) => {
  const serverOptions = {
    typeDefs,
    resolvers,
    schemaDirectives,
    resolverValidationOptions: {
      requireResolversForResolveType: false,
    },
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

  return new ApolloServer(serverOptions);
};

export default createApolloServer;
