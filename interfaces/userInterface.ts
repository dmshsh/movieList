import { Document } from "mongoose";
export interface IUser extends Document {
  email: string;
  name?: string;
  passwordHash: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}