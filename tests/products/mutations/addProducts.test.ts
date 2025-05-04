import { mutations } from "../../../server/graphql/products/mutations";
import Accounts from "../../../server/models/accounts";
import mongoose from "mongoose";
import { cnxAccounts, cnxProducts } from "../../../server/db/mongodb";

afterAll(async () => {
    await Promise.all([cnxAccounts.close(), cnxProducts.close()]);
});

describe("addProducts", () => {
    test("should insert products when data is valid", async () => {
        const account = await Accounts.create({
            name: "test",
            email: "test@gmail.com",
        });

        const result = await mutations.addProducts(
            {},
            {
                accountId: account._id.toString(),
                products: [
                    { name: "Product A", sku: "SKU123" },
                    { name: "Product B", sku: "SKU456" },
                ],
            },
        );

        expect(result).toHaveLength(2);
        expect(result[0]).toHaveProperty("_id");
        expect(result[0]).toHaveProperty("name", "Product A");
        expect(result[0]).toHaveProperty("sku", "SKU123");
        expect(result[1]).toHaveProperty("_id");
        expect(result[1]).toHaveProperty("name", "Product B");
        expect(result[1]).toHaveProperty("sku", "SKU456");
    });

    test("should throw an error if account does not exist", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();

        await expect(
            mutations.addProducts(
                {},
                {
                    accountId: fakeId,
                    products: [{ name: "Producto 123", sku: "sku123" }],
                },
            ),
        ).rejects.toThrow("Account not found");
    });

    test("should throw an error if products list is empty", async () => {
        const fakeAccountId = new mongoose.Types.ObjectId().toString();

        await expect(
            mutations.addProducts(
                {},
                { accountId: fakeAccountId, products: [] },
            ),
        ).rejects.toThrow("Product list cannot be empty");
    });
});
