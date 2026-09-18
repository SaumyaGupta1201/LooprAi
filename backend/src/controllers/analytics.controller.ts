import { Request, Response } from "express";
import { Transaction } from "../models/Transaction";
import { buildBasePipeline, TxnQuery } from "../services/query.service";
import { asyncHandler } from "../utils/ApiError";

/** Summary cards: Balance, Revenue, Expenses, Savings. */
export const getSummary = asyncHandler(async (req: Request, res: Response) => {
  const pipeline = buildBasePipeline(req.query as unknown as TxnQuery);

  const rows = await Transaction.aggregate([
    ...pipeline,
    {
      $group: {
        _id: { category: "$category", status: "$status" },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  let revenue = 0, expenses = 0, pendingRevenue = 0, pendingExpenses = 0, count = 0;

  for (const r of rows) {
    count += r.count;
    const paid = r._id.status === "Paid";
    if (r._id.category === "Revenue") paid ? (revenue += r.total) : (pendingRevenue += r.total);
    else paid ? (expenses += r.total) : (pendingExpenses += r.total);
  }

  const balance = revenue - expenses;

  res.json({
    success: true,
    data: {
      revenue,
      expenses,
      balance,
      // Savings = share of realised revenue not consumed by expenses
      savings: revenue > 0 ? Math.max(0, balance) : 0,
      savingsRate: revenue > 0 ? Number(((balance / revenue) * 100).toFixed(1)) : 0,
      pendingRevenue,
      pendingExpenses,
      transactionCount: count,
    },
  });
});

/** Revenue vs Expense trend, grouped monthly. */
export const getTrend = asyncHandler(async (req: Request, res: Response) => {
  const pipeline = buildBasePipeline(req.query as unknown as TxnQuery);

  const rows = await Transaction.aggregate([
    ...pipeline,
    {
      $group: {
        _id: { y: { $year: "$date" }, m: { $month: "$date" }, category: "$category" },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.y": 1, "_id.m": 1 } },
  ]);

  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const bucket = new Map<string, { label: string; revenue: number; expenses: number }>();

  for (const r of rows) {
    const key = `${r._id.y}-${String(r._id.m).padStart(2, "0")}`;
    if (!bucket.has(key)) {
      bucket.set(key, { label: `${MONTHS[r._id.m - 1]} ${r._id.y}`, revenue: 0, expenses: 0 });
    }
    const entry = bucket.get(key)!;
    if (r._id.category === "Revenue") entry.revenue += r.total;
    else entry.expenses += r.total;
  }

  const data = [...bucket.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, v]) => ({ key, ...v, net: v.revenue - v.expenses }));

  res.json({ success: true, data });
});

/** Category + status breakdown for the donut / bars. */
export const getBreakdown = asyncHandler(async (req: Request, res: Response) => {
  const pipeline = buildBasePipeline(req.query as unknown as TxnQuery);

  const [byCategory, byStatus, byUser] = await Promise.all([
    Transaction.aggregate([
      ...pipeline,
      { $group: { _id: "$category", total: { $sum: "$amount" }, count: { $sum: 1 } } },
      { $project: { _id: 0, name: "$_id", total: 1, count: 1 } },
    ]),
    Transaction.aggregate([
      ...pipeline,
      { $group: { _id: "$status", total: { $sum: "$amount" }, count: { $sum: 1 } } },
      { $project: { _id: 0, name: "$_id", total: 1, count: 1 } },
    ]),
    Transaction.aggregate([
      ...pipeline,
      {
        $group: {
          _id: "$userName",
          revenue: { $sum: { $cond: [{ $eq: ["$category", "Revenue"] }, "$amount", 0] } },
          expenses: { $sum: { $cond: [{ $eq: ["$category", "Expense"] }, "$amount", 0] } },
        },
      },
      { $project: { _id: 0, name: "$_id", revenue: 1, expenses: 1 } },
      { $sort: { revenue: -1 } },
    ]),
  ]);

  res.json({ success: true, data: { byCategory, byStatus, byUser } });
});

/** Latest N transactions for the side panel. */
export const getRecent = asyncHandler(async (req: Request, res: Response) => {
  const limit = Math.min(20, Number(req.query.limit) || 5);
  const rows = await Transaction.aggregate([
    ...buildBasePipeline({}),
    { $sort: { date: -1 } },
    { $limit: limit },
  ]);
  res.json({ success: true, data: rows });
});