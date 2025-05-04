import { Schema } from "mongoose";
import { IProduct } from "../interfaces/product";
import { cnxProducts } from "../db/mongodb";

const productsSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        sku: { type: String, required: true },
        accountId: {
            type: Schema.Types.ObjectId,
            ref: "Accounts",
            required: true,
        },
    },
    { timestamps: true },
);

const Products = cnxProducts.model<IProduct>("Products", productsSchema);
export default Products;
