import { Schema } from "mongoose";
import { IUser } from "../interfaces/userInterface.js";
export const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    name: { type: String },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user", required: true },
  },
  { timestamps: true }
);
