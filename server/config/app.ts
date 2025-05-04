import "dotenv/config";

const isTest = process.env.NODE_ENV === "test";
console.info(`Running on ${process.env.NODE_ENV} environment`);

const config = {
    server: {
        port: process.env.PORT || process.env.APP_PORT!,
    },
    dbnorel: {
        accounts: {
            uri: isTest
                ? process.env.MONGODB_URL_ACCOUNTS_TEST!
                : process.env.MONGODB_URL_ACCOUNTS!,
        },
        products: {
            uri: isTest
                ? process.env.MONGODB_URL_PRODUCTS_TEST!
                : process.env.MONGODB_URL_PRODUCTS!,
        },
    },
    pagination: {
        page: Number(process.env.PAGE) || 1,
        perPage: Number(process.env.PER_PAGE) || 20,
    },
};

export default config;
