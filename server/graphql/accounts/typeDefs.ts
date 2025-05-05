import { gql } from "apollo-server-express";

export const typeDefs = gql`
    type Account {
        _id: ID!
        name: String!
        email: String!
        createdAt: String
        updatedAt: String
    }

    type AccountList {
        total: Int!
        accounts: [Account!]!
    }
`;
