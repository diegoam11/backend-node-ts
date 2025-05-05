/**
 * @jest-environment node
 */

import { mutations as productMutations } from "../../../server/graphql/products/mutations";
import { mutations as accountMutations } from "../../../server/graphql/accounts/mutations";
import { queries } from "../../../server/graphql/products/queries";
import Products from "../../../server/models/products";
import Accounts from "../../../server/models/accounts";
import { cnxAccounts, cnxProducts } from "../../../server/db/mongodb";

let testAccountId: string;

beforeAll(async () => {
    await Products.deleteMany({});
    await Accounts.deleteMany({});

    // crear cuenta de prueba para asociarla a los productos
    const account = await accountMutations.createAccount(
        {},
        {
            name: "Test Account",
            email: "account@test.com",
        },
    );

    testAccountId = account._id;

    // usar addProducts para insertar productos correctamente
    await productMutations.addProducts(
        {},
        {
            accountId: testAccountId,
            products: [
                { name: "Product A", sku: "SKU001" },
                { name: "Product B", sku: "SKU002" },
                { name: "Another Product", sku: "SKU003" },
            ],
        },
    );
});

afterAll(async () => {
    await Products.deleteMany({});
    await Accounts.deleteMany({});
    await Promise.all([cnxAccounts.close(), cnxProducts.close()]);
});

describe("listProducts", () => {
    test("returns paginated products", async () => {
        const result = await queries.listProducts({}, { limit: 2, page: 1 });

        expect(result.total).toBe(3);
        expect(result.products.length).toBeLessThanOrEqual(2);
    });

    test("returns correct products for page 2", async () => {
        const result = await queries.listProducts({}, { limit: 2, page: 2 });

        expect(result.total).toBe(3);
        expect(result.products.length).toBe(1); // solo queda 1 en la pagina 2
    });

    test("filters by search term (name)", async () => {
        const result = await queries.listProducts(
            {},
            { search: "Another", limit: 10, page: 1 },
        );

        expect(result.total).toBe(1);
        expect(result.products[0].name).toBe("Another Product");
    });

    test("filters by search term (sku)", async () => {
        const result = await queries.listProducts(
            {},
            { search: "SKU001", limit: 10, page: 1 },
        );

        expect(result.total).toBe(1);
        expect(result.products[0].sku).toBe("SKU001");
    });

    test("returns empty if no match", async () => {
        const result = await queries.listProducts(
            {},
            { search: "nonexistent", limit: 10, page: 1 },
        );

        expect(result.total).toBe(0);
        expect(result.products.length).toBe(0);
    });

    test("returns empty for out-of-range page", async () => {
        const result = await queries.listProducts({}, { limit: 2, page: 100 });

        expect(result.total).toBe(3);
        expect(result.products.length).toBe(0);
    });
});
