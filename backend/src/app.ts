import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import routes from "./routes";
import { notFound, errorHandler } from "./middleware/error";

const app: Application = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
    exposedHeaders: ["Content-Disposition", "X-Row-Count"],
  })
);
app.use(express.json({ limit: "1mb" }));

app.use(
  "/api",
  rateLimit({ windowMs: 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false })
);

app.get("/health", (_req, res) => res.json({ status: "ok", time: new Date() }));
app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;