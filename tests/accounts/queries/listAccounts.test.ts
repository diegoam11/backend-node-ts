/**
 * @jest-environment node
 */

import { queries } from "../../../server/graphql/accounts/queries";
import Accounts from "../../../server/models/accounts";
import Products from "../../../server/models/products";
import { cnxAccounts, cnxProducts } from "../../../server/db/mongodb";

beforeAll(async () => {
    await Accounts.deleteMany({});
    await Products.deleteMany({});

    await Accounts.insertMany([
        { name: "Alice", email: "alice@example.com" },
        { name: "Bob", email: "bob@example.com" },
        { name: "Charlie", email: "charlie@example.com" },
    ]);
});

afterAll(async () => {
    await Accounts.deleteMany({});
    await Products.deleteMany({});
    await Promise.all([cnxAccounts.close(), cnxProducts.close()]);
});

describe("listAccounts", () => {
    test("returns paginated accounts", async () => {
        const result = await queries.listAccounts({}, { limit: 2, page: 1 });

        expect(result.total).toBe(3);
        expect(result.accounts.length).toBeLessThanOrEqual(2);
    });

    test("returns correct accounts for page 2", async () => {
        const result = await queries.listAccounts({}, { limit: 2, page: 2 });

        expect(result.total).toBe(3);
        expect(result.accounts.length).toBe(1);
    });

    test("filters by search term (name)", async () => {
        const result = await queries.listAccounts(
            {},
            { search: "alice", limit: 10, page: 1 },
        );

        expect(result.total).toBe(1);
        expect(result.accounts[0].name).toBe("Alice");
    });

    test("filters by search term (email)", async () => {
        const result = await queries.listAccounts(
            {},
            { search: "bob@example.com", limit: 10, page: 1 },
        );

        expect(result.total).toBe(1);
        expect(result.accounts[0].email).toBe("bob@example.com");
    });

    test("returns empty if no match", async () => {
        const result = await queries.listAccounts(
            {},
            { search: "notfound", limit: 10, page: 1 },
        );

        expect(result.total).toBe(0);
        expect(result.accounts.length).toBe(0);
    });

    test("returns empty for out-of-range page", async () => {
        const result = await queries.listAccounts({}, { limit: 2, page: 100 });

        expect(result.total).toBe(3);
        expect(result.accounts.length).toBe(0);
    });
});
