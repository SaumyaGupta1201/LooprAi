import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAccount extends Document {
  email: string;
  password: string;
  name: string;
  avatar: string;
  comparePassword(candidate: string): Promise<boolean>;
}

const accountSchema = new Schema<IAccount>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    name: { type: String, required: true },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);

accountSchema.pre("save", async function (this: IAccount) {
  const doc = this as IAccount;
  if (!doc.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  doc.password = await bcrypt.hash(doc.password, salt);
});

accountSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const Account = mongoose.model<IAccount>("Account", accountSchema);