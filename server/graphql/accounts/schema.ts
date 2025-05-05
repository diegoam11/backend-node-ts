import { gql } from "apollo-server-express";

export const schema = gql`
    extend type Query {
        testAccQ: Int
        listAccounts(search: String, limit: Int, page: Int): AccountList!
    }

    extend type Mutation {
        testAccM: Boolean
        createAccount(name: String!, email: String!): Account!
    }
`;
