import Products from "../../models/products";
import { validatePagination } from "../accounts/helpers/validatePagination";
import { ApolloError } from "apollo-server-express";
import { PipelineStage } from "mongoose";

type ListProductsArgs = {
    search?: string;
    limit: number;
    page: number;
};

export const queries = {
    testProdQ: (_: any) => {
        return true;
    },
    listProducts: async (_: any, args: ListProductsArgs) => {
        try {
            const { limit, page } = validatePagination(args);
            const skip = (page - 1) * limit;

            const matchStage = args.search
                ? {
                      $or: [
                          { name: { $regex: args.search, $options: "i" } },
                          { sku: { $regex: args.search, $options: "i" } },
                      ],
                  }
                : {};

            const pipeline: PipelineStage[] = [
                { $match: matchStage },
                {
                    $facet: {
                        total: [{ $count: "count" }],
                        products: [
                            { $sort: { createdAt: -1 } },
                            { $skip: skip },
                            { $limit: limit },
                        ],
                    },
                },
                {
                    $project: {
                        total: {
                            $ifNull: [{ $arrayElemAt: ["$total.count", 0] }, 0],
                        },
                        products: 1,
                    },
                },
            ];

            const result = await Products.aggregate(pipeline);
            return result[0];
        } catch (error) {
            throw new ApolloError(
                "Failed to list products",
                "LIST_PRODUCTS_ERROR",
                {
                    originalError: error,
                },
            );
        }
    },
};
