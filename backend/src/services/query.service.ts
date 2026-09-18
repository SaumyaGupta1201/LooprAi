import { PipelineStage } from "mongoose";

export interface TxnQuery {
  search?: string;
  category?: string;   // comma separated
  status?: string;     // comma separated
  user_id?: string;    // comma separated
  startDate?: string;
  endDate?: string;
  minAmount?: string;
  maxAmount?: string;
}

const splitCsv = (v?: string) =>
  v ? v.split(",").map((s) => s.trim()).filter(Boolean) : [];

/** Builds the $match stage from query params. */
export const buildMatch = (q: TxnQuery): Record<string, unknown> => {
  const match: Record<string, unknown> = {};

  const categories = splitCsv(q.category);
  if (categories.length) match.category = { $in: categories };

  const statuses = splitCsv(q.status);
  if (statuses.length) match.status = { $in: statuses };

  const users = splitCsv(q.user_id);
  if (users.length) match.user_id = { $in: users };

  if (q.startDate || q.endDate) {
    const range: Record<string, Date> = {};
    if (q.startDate) range.$gte = new Date(q.startDate);
    if (q.endDate) {
      const end = new Date(q.endDate);
      end.setHours(23, 59, 59, 999);
      range.$lte = end;
    }
    match.date = range;
  }

  if (q.minAmount || q.maxAmount) {
    const range: Record<string, number> = {};
    if (q.minAmount) range.$gte = Number(q.minAmount);
    if (q.maxAmount) range.$lte = Number(q.maxAmount);
    match.amount = range;
  }

  return match;
};

/** Joins member names, then applies free-text search across all visible fields. */
export const buildBasePipeline = (q: TxnQuery): PipelineStage[] => {
  const pipeline: PipelineStage[] = [
    { $match: buildMatch(q) },
    {
      $lookup: {
        from: "members",
        localField: "user_id",
        foreignField: "user_id",
        as: "member",
      },
    },
    { $unwind: { path: "$member", preserveNullAndEmptyArrays: true } },
    {
      $addFields: {
        userName: { $ifNull: ["$member.name", "$user_id"] },
        avatar: { $ifNull: ["$member.avatar", "$user_profile"] },
      },
    },
  ];

  if (q.search && q.search.trim()) {
    const rx = new RegExp(q.search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    pipeline.push({
      $addFields: { amountStr: { $toString: "$amount" }, idStr: { $toString: "$txnId" } },
    });
    pipeline.push({
      $match: {
        $or: [
          { userName: rx },
          { user_id: rx },
          { category: rx },
          { status: rx },
          { amountStr: rx },
          { idStr: rx },
        ],
      },
    });
  }

  pipeline.push({ $project: { member: 0, amountStr: 0, idStr: 0, __v: 0 } });
  return pipeline;
};

const SORTABLE = ["date", "amount", "category", "status", "userName", "txnId"];

export const buildSort = (sortBy?: string, order?: string): Record<string, 1 | -1> => {
  const field = SORTABLE.includes(sortBy || "") ? (sortBy as string) : "date";
  return { [field]: order === "asc" ? 1 : -1 };
};