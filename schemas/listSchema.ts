import { Schema } from "mongoose";
import { ListEntry } from "../interfaces/listEntry.js";

export const listSchema = new Schema<ListEntry>({
    id: { type: Number, required: true, unique: true },
    movieId: { type: Number, required: true },
    list: { type: String, required: true, enum: ['watchlist', 'favorites', 'watched'] },
    rating: { type: Number, required: false }
});