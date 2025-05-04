import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { createAccountLoader } from "./accounts/loaders/accountLoader";

import { typeDefs, resolvers } from "./root";

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

async function startApolloServer(app: any) {
    const apolloServer = new ApolloServer({
        schema,
        csrfPrevention: true,
        context: () => ({
            loaders: {
                accountLoader: createAccountLoader(),
            },
        }),
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, path: "/graphql" });
}

export { startApolloServer };
