import { ApolloError } from "apollo-server-express";

type ProductInput = {
    name: string;
    sku: string;
};

export function validateProductsInput(products: ProductInput[]) {
    if (!Array.isArray(products) || products.length === 0) {
        throw new ApolloError(
            "Product list cannot be empty",
            "INVALID_PRODUCTS",
        );
    }

    for (const product of products) {
        if (!product.name || typeof product.name !== "string") {
            throw new ApolloError(
                "Invalid product name",
                "INVALID_PRODUCT_NAME",
            );
        }
        if (!product.sku || typeof product.sku !== "string") {
            throw new ApolloError("Invalid product SKU", "INVALID_PRODUCT_SKU");
        }
    }
}
