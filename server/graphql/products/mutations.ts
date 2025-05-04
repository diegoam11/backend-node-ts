import mongoose from "mongoose";
import Products from "../../models/products";
import Accounts from "../../models/accounts";
import { ApolloError } from "apollo-server-express";
import { validateProductsInput } from "./helpers/validateProductsInput";

type ProductInput = {
    name: string;
    sku: string;
};

export const mutations = {
    testProdM: async (_: any) => true,

    addProducts: async (
        _: any,
        args: { accountId: string; products: ProductInput[] },
    ) => {
        const { accountId, products } = args;

        if (!mongoose.Types.ObjectId.isValid(accountId)) {
            throw new ApolloError(
                "Invalid account ID format",
                "INVALID_ACCOUNT_ID",
            );
        }

        validateProductsInput(products);

        const accountExists = await Accounts.findById(accountId);
        if (!accountExists) {
            throw new ApolloError("Account not found", "ACCOUNT_NOT_FOUND");
        }

        try {
            const created = await Products.insertMany(
                products.map((p) => ({
                    ...p,
                    accountId,
                })),
            );

            return created;
        } catch (err) {
            throw new ApolloError(
                "Failed to add products",
                "PRODUCT_CREATION_FAILED",
                {
                    originalError: err,
                },
            );
        }
    },
};
