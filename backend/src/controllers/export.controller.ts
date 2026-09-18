import { Request, Response } from "express";
import { z } from "zod";
import { Transaction } from "../models/Transaction";
import { buildBasePipeline, buildSort, TxnQuery } from "../services/query.service";
import { generateCsv, EXPORTABLE_COLUMNS } from "../services/csv.service";
import { ApiError, asyncHandler } from "../utils/ApiError";

const VALID_KEYS = EXPORTABLE_COLUMNS.map((c) => c.key);

const exportSchema = z.object({
  columns: z.array(z.string()).min(1, "Select at least one column to export"),
  filters: z.record(z.string(), z.string()).optional(),
  sortBy: z.string().optional(),
  order: z.string().optional(),
  filename: z.string().optional(),
});

export const getExportColumns = asyncHandler(async (_req: Request, res: Response) => {
  res.json({ success: true, data: EXPORTABLE_COLUMNS });
});

export const exportCsv = asyncHandler(async (req: Request, res: Response) => {
  const parsed = exportSchema.safeParse(req.body);
  if (!parsed.success) throw new ApiError(400, parsed.error.issues[0].message);

  const { columns, filters = {}, sortBy, order, filename } = parsed.data;

  // Keep the user's chosen order, drop anything unknown
  const selected = columns.filter((c) => VALID_KEYS.includes(c));
  if (!selected.length) throw new ApiError(400, "No valid columns were selected");

  const rows = await Transaction.aggregate([
    ...buildBasePipeline(filters as TxnQuery),
    { $sort: buildSort(sortBy, order) },
  ]);

  if (!rows.length) throw new ApiError(404, "No transactions match these filters — nothing to export");

  const csv = generateCsv(rows, selected);
  const stamp = new Date().toISOString().split("T")[0];
  const safeName = (filename || `loopr-transactions-${stamp}`).replace(/[^a-z0-9_-]/gi, "_");

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${safeName}.csv"`);
  res.setHeader("X-Row-Count", String(rows.length));
  res.setHeader("Access-Control-Expose-Headers", "Content-Disposition, X-Row-Count");
  res.status(200).send(csv);
});