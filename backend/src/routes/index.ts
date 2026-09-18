import { Router } from "express";
import { login, logout, me } from "../controllers/auth.controller";
import { listTransactions, getFilterOptions } from "../controllers/transaction.controller";
import { getSummary, getTrend, getBreakdown, getRecent } from "../controllers/analytics.controller";
import { exportCsv, getExportColumns } from "../controllers/export.controller";
import { protect } from "../middleware/auth";

const router = Router();

// --- Public ---
router.post("/auth/login", login);

// --- Protected ---
router.use(protect);

router.get("/auth/me", me);
router.post("/auth/logout", logout);

router.get("/transactions", listTransactions);
router.get("/transactions/filters", getFilterOptions);

router.get("/analytics/summary", getSummary);
router.get("/analytics/trend", getTrend);
router.get("/analytics/breakdown", getBreakdown);
router.get("/analytics/recent", getRecent);

router.get("/export/columns", getExportColumns);
router.post("/export/csv", exportCsv);

export default router;