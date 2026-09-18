import mongoose, { Document, Schema } from "mongoose";

export type Category = "Revenue" | "Expense";
export type Status = "Paid" | "Pending";

export interface ITransaction extends Document {
  txnId: number;
  date: Date;
  amount: number;
  category: Category;
  status: Status;
  user_id: string;
  user_profile: string;
}

const transactionSchema = new Schema<ITransaction>(
  {
    txnId: { type: Number, required: true, unique: true },
    date: { type: Date, required: true, index: true },
    amount: { type: Number, required: true, index: true },
    category: { type: String, enum: ["Revenue", "Expense"], required: true, index: true },
    status: { type: String, enum: ["Paid", "Pending"], required: true, index: true },
    user_id: { type: String, required: true, index: true },
    user_profile: { type: String, default: "" },
  },
  { timestamps: true }
);

// Compound index for the most common query shape (filter + sort by date)
transactionSchema.index({ category: 1, status: 1, date: -1 });

export const Transaction = mongoose.model<ITransaction>("Transaction", transactionSchema);