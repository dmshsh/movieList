import { model } from "mongoose";
import { IUser } from "../interfaces/userInterface.js";
import { userSchema } from "../schemas/userSchema.js";
export const UserModel = model<IUser>("User", userSchema);