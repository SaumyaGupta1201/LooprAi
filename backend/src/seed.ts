import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { connectDB } from "./config/db";
import { Transaction } from "./models/Transaction";
import { Member } from "./models/Member";
import { Account } from "./models/Account";

interface RawTxn {
  id: number;
  date: string;
  amount: number;
  category: string;
  status: string;
  user_id: string;
  user_profile?: string;
}

// The dataset only has user_001..004 — give each a real identity.
const MEMBERS = [
  { user_id: "user_001", name: "Matheus Ferrero", avatar: "https://i.pravatar.cc/120?img=12" },
  { user_id: "user_002", name: "Floyd Miles",     avatar: "https://i.pravatar.cc/120?img=33" },
  { user_id: "user_003", name: "Jerome Bell",     avatar: "https://i.pravatar.cc/120?img=52" },
  { user_id: "user_004", name: "Sarah Johnson",   avatar: "https://i.pravatar.cc/120?img=45" },
];

const run = async () => {
  await connectDB();

  const file = path.join(__dirname, "..", "data", "transactions.json");
  if (!fs.existsSync(file)) {
    throw new Error(`transactions.json not found at ${file}`);
  }
  const raw: RawTxn[] = JSON.parse(fs.readFileSync(file, "utf-8"));

  await Promise.all([
    Transaction.deleteMany({}),
    Member.deleteMany({}),
    Account.deleteMany({}),
  ]);

  await Member.insertMany(MEMBERS);

  const docs = raw.map((t) => ({
    txnId: t.id,
    date: new Date(t.date),
    amount: t.amount,
    category: t.category,
    status: t.status,
    user_id: t.user_id,
    user_profile:
      MEMBERS.find((m) => m.user_id === t.user_id)?.avatar || t.user_profile || "",
  }));
  await Transaction.insertMany(docs);

  // Seeded analyst account — password is hashed by the model's pre-save hook
  await Account.create({
    email: process.env.DEMO_EMAIL || "analyst@loopr.ai",
    password: process.env.DEMO_PASSWORD || "Loopr@123",
    name: "Saumya Gupta",
    avatar: "https://i.pravatar.cc/120?img=47",
  });

  console.log(`✅ Seeded ${docs.length} transactions, ${MEMBERS.length} members, 1 account`);
  console.log(`   Login → ${process.env.DEMO_EMAIL} / ${process.env.DEMO_PASSWORD}`);

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});