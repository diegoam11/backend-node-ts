import Accounts from "../../models/accounts";
import { validatePagination } from "./helpers/validatePagination";
import { ApolloError } from "apollo-server-express";
import { PipelineStage } from "mongoose";

type ListAccountsArgs = {
    search?: string;
    limit: number;
    page: number;
};

export const queries = {
    testAccQ: async (_: any) => {
        const accounts = await Accounts.find({});
        return accounts.length;
    },
    listAccounts: async (_: any, args: ListAccountsArgs) => {
        try {
            const { limit, page } = validatePagination(args);
            const skip = (page - 1) * limit;

            const matchStage = args.search
                ? {
                      $or: [
                          { name: { $regex: args.search, $options: "i" } },
                          { email: { $regex: args.search, $options: "i" } },
                      ],
                  }
                : {};

            const pipeline: PipelineStage[] = [
                { $match: matchStage },
                {
                    $facet: {
                        total: [{ $count: "count" }],
                        accounts: [
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
                        accounts: 1,
                    },
                },
            ];

            const result = await Accounts.aggregate(pipeline);
            return result[0];
        } catch (error) {
            console.error("Error listing accounts:", error);
            throw new ApolloError(
                "Failed to list accounts",
                "LIST_ACCOUNTS_ERROR",
            );
        }
    },
};
