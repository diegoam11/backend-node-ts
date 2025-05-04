import { gql } from "apollo-server-express";

export const typeDefs = gql`
    input ProductInput {
        name: String!
        sku: String!
    }

    type Product {
        _id: ID!
        name: String!
        sku: String!
        accountId: ID!
        account: Account
        createdAt: String
        updatedAt: String
    }

    type ProductList {
        total: Int!
        products: [Product!]!
    }
`;
