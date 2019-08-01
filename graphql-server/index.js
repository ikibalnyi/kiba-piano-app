const { ApolloServer, gql } = require('apollo-server');
const { MongoMemoryServer } = require('mongodb-memory-server');
const getMongoConnection = require('./getMongoConnection');

// don't require a separate mongodb instance to run
// eslint-disable-next-line no-new
new MongoMemoryServer({ instance: { port: 27017 } });

const typeDefs = gql`
    input NoteEventInput {
        midiNumber: Int
        startTime: Int
        duration: Int
    }

    type NoteEvent {
        midiNumber: Int
        startTime: Int
        duration: Int
    }
  
    type Song {
        _id: ID!
        title: String
        keySequence: [NoteEvent]
    }

    type Query {
        songs: [Song]
    }

    type Mutation {
        addSong(title: String, keySequence: [NoteEventInput]): Song
    }
`;

const resolvers = {
  Query: {
    songs: async () => {
      const mongodb = await getMongoConnection();
      return mongodb.collection('songs').find({}).toArray();
    },
  },
  Mutation: {
    addSong: async (_, { title, keySequence }) => {
      const mongodb = await getMongoConnection();
      try {
        const response = await mongodb.collection('songs').insertOne({ title, keySequence });
        return mongodb.collection('songs').findOne({ _id: response.insertedId });
      } catch (e) {
        console.error(e);
        throw (e);
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`GraphQL server running: ${url}`);
});
