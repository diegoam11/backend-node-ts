import { gql } from "apollo-server-express";

import {
    schema as accountsSchema,
    queries as accountsQueries,
    mutations as accountsMutations,
    typeDefs as accountTypeDefs,
} from "../accounts";

import {
    schema as productsSchema,
    queries as productsQueries,
    mutations as productsMutations,
    typeDefs as productTypeDefs,
} from "../products";

const rootTypeDefs = gql`
    type Query {
        _: String
    }

    type Mutation {
        _: String
    }
`;

export const typeDefs = [
    rootTypeDefs,
    accountTypeDefs,
    productTypeDefs,
    accountsSchema,
    productsSchema,
];

export const resolvers: any = {
    Query: {
        ...accountsQueries,
        ...productsQueries,
    },
    Mutation: {
        ...accountsMutations,
        ...productsMutations,
    },
    Product: {
        account: async (parent: any, _args: any, context: any) => {
            return context.loaders.accountLoader.load(parent.accountId);
        },
    },
};
