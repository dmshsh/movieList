import { model } from "mongoose";
import { Movie } from "../interfaces/movieInterface.js";
import { movieSchema } from "../schemas/movieSchema.js";
export const MovieModel = model<Movie>("Movie", movieSchema);