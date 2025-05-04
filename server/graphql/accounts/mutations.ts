import { validateAccountInput } from "./helpers/validateAccountInput";
import Accounts from "../../models/accounts";
import { ApolloError } from "apollo-server-express";

export const mutations = {
    testAccM: async (_: any) => {
        return true;
    },
    createAccount: async (_: any, args: { name: string; email: string }) => {
        try {
            validateAccountInput(args);

            const existingAccount = await Accounts.findOne({
                email: args.email,
            });

            if (existingAccount) {
                throw new ApolloError(
                    "Email already registered",
                    "EMAIL_EXISTS",
                );
            }

            const newAccount = new Accounts({
                name: args.name,
                email: args.email,
            });

            await newAccount.save();

            return newAccount;
        } catch (error) {
            if (error instanceof ApolloError) {
                throw error;
            }
            console.error("Error creating account:", error);
            throw new ApolloError(
                "Unexpected error while creating account",
                "CREATE_ACCOUNT_FAILED",
            );
        }
    },
};
