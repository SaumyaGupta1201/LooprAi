import mongoose, { Document, Schema } from "mongoose";

export interface IMember extends Document {
  user_id: string;
  name: string;
  avatar: string;
}

const memberSchema = new Schema<IMember>({
  user_id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  avatar: { type: String, default: "" },
});

export const Member = mongoose.model<IMember>("Member", memberSchema);