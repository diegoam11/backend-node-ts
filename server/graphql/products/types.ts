import { gql } from "apollo-server-express";

export const types = gql`
    input ProductInput {
        name: String!
        sku: String!
    }

    type Product {
        _id: ID!
        name: String!
        sku: String!
        accountId: ID!
        createdAt: String
        updatedAt: String
    }
`;
