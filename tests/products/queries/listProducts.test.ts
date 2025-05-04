import { mutations as productMutations } from "../../../server/graphql/products/mutations";
import { mutations as accountMutations } from "../../../server/graphql/accounts/mutations";
import { queries } from "../../../server/graphql/products/queries";
import Products from "../../../server/models/products";
import { cnxProducts, cnxAccounts } from "../../../server/db/mongodb";
import Accounts from "../../../server/models/accounts";

beforeAll(async () => {
    await Products.deleteMany({});

    // crear cuenta de prueba para asociarla a los productos
    const account = await accountMutations.createAccount(
        {},
        {
            name: "Test Account",
            email: "account@test.com",
        },
    );

    // usar addProducts para insertar productos correctamente
    await productMutations.addProducts(
        {},
        {
            accountId: account._id,
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
    await cnxProducts.close();
    await cnxAccounts.close();
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
