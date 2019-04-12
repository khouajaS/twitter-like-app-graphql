import { gql } from 'apollo-server';
import { merge } from 'lodash';
import User from '../types/user.type'; // cyclic dependency

const TimeLine = gql`
  type TimeLine {
    threads: [Thread]
  }
`;


const timeLineQuery = gql`
  extend type Query {
    timeLine: TimeLine
  }
`;


const resolvers = {
  Query: {
    timeLine: async (_, $, { models, user }) => {
      const { following } = await models.User.findOne({ _id: user.id });
      return models.Tweet.find({ owner: { $in: following.concat([user.id]) } });
    },
  },
};


export default {
  typeDefs: [
    TimeLine,
    timeLineQuery,
    ...User.typeDefs,
  ],
  resolvers: merge(resolvers, User.resolvers),
};
