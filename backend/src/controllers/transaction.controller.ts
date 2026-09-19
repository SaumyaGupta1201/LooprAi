import { Request, Response } from "express";
import { Transaction } from "../models/Transaction";
import { Member } from "../models/Member";
import { buildBasePipeline, buildSort, txnQuerySchema, TxnQuery } from "../services/query.service";
import { ApiError, asyncHandler } from "../utils/ApiError";

export const listTransactions = asyncHandler(async (req: Request, res: Response) => {
  const parsed = txnQuerySchema.safeParse(req.query);
  if (!parsed.success) throw new ApiError(400, parsed.error.issues[0].message);
  const q = parsed.data as TxnQuery & { page?: number; limit?: number; sortBy?: string; order?: string };

  const page = Math.max(1, Number(q.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(q.limit) || 10));
  const skip = (page - 1) * limit;

  const pipeline = buildBasePipeline(q);

  const [result] = await Transaction.aggregate([
    ...pipeline,
    {
      $facet: {
        rows: [{ $sort: buildSort(q.sortBy, q.order) }, { $skip: skip }, { $limit: limit }],
        meta: [{ $count: "total" }],
      },
    },
  ]);

  const total = result?.meta?.[0]?.total ?? 0;

  res.json({
    success: true,
    data: result?.rows ?? [],
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  });
});

/** Powers the filter dropdowns without hardcoding values in the UI. */
export const getFilterOptions = asyncHandler(async (_req: Request, res: Response) => {
  const [categories, statuses, members, bounds] = await Promise.all([
    Transaction.distinct("category"),
    Transaction.distinct("status"),
    Member.find().select("user_id name avatar -_id").lean(),
    Transaction.aggregate([
      { $group: { _id: null, min: { $min: "$amount" }, max: { $max: "$amount" } } },
    ]),
  ]);

  res.json({
    success: true,
    data: {
      categories,
      statuses,
      users: members,
      amountRange: { min: bounds[0]?.min ?? 0, max: bounds[0]?.max ?? 0 },
    },
  });
});