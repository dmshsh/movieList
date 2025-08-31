import { model } from "mongoose";
import { listSchema } from "../schemas/listSchema.js";
import { ListEntry } from "../interfaces/listEntry.js";
export const ListModel = model<ListEntry>("ListEntry", listSchema);