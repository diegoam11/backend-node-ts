import DataLoader from "dataloader";
import Accounts from "../../../models/accounts";
import { Types } from "mongoose";

const batchAccounts = async (accountIds: readonly Types.ObjectId[]) => {
    const accounts = await Accounts.find({ _id: { $in: accountIds } }).lean();

    const accountMap = new Map(
        accounts.map((acc) => [acc._id.toString(), acc]),
    );

    return accountIds.map((id) => accountMap.get(id.toString()) || null);
};

export const createAccountLoader = () =>
    new DataLoader<Types.ObjectId, any>(batchAccounts);
