/**
 * @jest-environment node
 */

import { mutations } from "../../../server/graphql/accounts/mutations";
import Accounts from "../../../server/models/accounts";
import Products from "../../../server/models/products";
import { cnxAccounts, cnxProducts } from "../../../server/db/mongodb";

beforeAll(async () => {
    await Accounts.deleteMany({});
    await Products.deleteMany({});
});

afterAll(async () => {
    await Accounts.deleteMany({});
    await Products.deleteMany({});
    await Promise.all([cnxAccounts.close(), cnxProducts.close()]);
});

describe("createAccount", () => {
    test("should create account with valid input", async () => {
        const result = await mutations.createAccount(
            {},
            {
                name: "Test User",
                email: "test@example.com",
            },
        );

        expect(result).toHaveProperty("_id");
        expect(result).toHaveProperty("name", "Test User");
        expect(result).toHaveProperty("email", "test@example.com");
    });

    test.each([
        ["empty string", ""],
        ["whitespace", "   "],
    ])("should throw error if name is invalid (%s)", async (_, name) => {
        await expect(
            mutations.createAccount({}, { name, email: "valid@example.com" }),
        ).rejects.toThrow("Name is required.");
    });

    test.each([
        ["missing domain", "user@"],
        ["missing @", "user.domain.com"],
        ["space inside", "user @domain.com"],
        ["missing TLD like .com .net", "user@domain"],
        ["empty string", ""],
    ])("should throw error for invalid email format (%s)", async (_, email) => {
        await expect(
            mutations.createAccount({}, { name: "Test", email }),
        ).rejects.toThrow("Invalid email format.");
    });

    test("should throw error if email already exists", async () => {
        await Accounts.create({ name: "Test", email: "duplicate@example.com" });

        await expect(
            mutations.createAccount(
                {},
                { name: "Test", email: "duplicate@example.com" },
            ),
        ).rejects.toThrow("Email already registered");
    });
});
