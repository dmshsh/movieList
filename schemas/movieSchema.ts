import { Schema
 } from "mongoose";
import { Movie } from "../interfaces/movieInterface.js";
export const movieSchema = new Schema<Movie>({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },  
  avgRating: { type: Number, required: true },
  year: { type: Number, required: true },
  genres: { type: [String], required: true },
  ratingsCount: { type: Number, required: true }
});