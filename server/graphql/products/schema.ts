import { gql } from "apollo-server-express";

export const schema = gql`
    extend type Query {
        testProdQ: Int
        listProducts(search: String, limit: Int, page: Int): ProductList!
    }

    extend type Mutation {
        testProdM: Boolean
        addProducts(accountId: ID!, products: [ProductInput!]!): [Product!]!
    }
`;
