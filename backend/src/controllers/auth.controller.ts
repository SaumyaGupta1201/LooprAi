import { Request, Response } from "express";
import { z } from "zod";
import { Account } from "../models/Account";
import { signToken } from "../utils/jwt";
import { ApiError, asyncHandler } from "../utils/ApiError";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0].message);
  }

  const { email, password } = parsed.data;
  const account = await Account.findOne({ email: email.toLowerCase() }).select("+password");

  if (!account || !(await account.comparePassword(password))) {
    throw new ApiError(401, "Incorrect email or password");
  }

  const token = signToken({
    id: String(account._id),
    email: account.email,
    name: account.name,
  });

  res.json({
    success: true,
    token,
    user: { id: account._id, email: account.email, name: account.name, avatar: account.avatar },
  });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const account = await Account.findById(req.user?.id);
  if (!account) throw new ApiError(404, "Account no longer exists");
  res.json({ success: true, user: account });
});

// Stateless JWT: the client discards the token. Endpoint exists for a clean flow.
export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.json({ success: true, message: "Logged out successfully" });
});