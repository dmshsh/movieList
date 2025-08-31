import express, { Request, Response } from "express";
import { MovieModel } from "../models/movieModel.js";
import { requireAuth } from "../middleware/auth.js";
const router = express.Router();

router.post("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const { id, title, avgRating, year, genres, ratingsCount } = req.body;
    const movie = new MovieModel({
      id,
      title,
      avgRating,
      year,
      genres,
      ratingsCount,
    });
    await movie.save();
    res.status(201).json({ message: " Movie added:", movie });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
router.get("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const {
      year,
      genre,
      q,
      page = "1",
      limit = "20",
      sort = "-avgRating",
    } = req.query as Record<string, string>;

    const filter: Record<string, any> = {};

    if (year) filter.year = Number(year);
 
    if (genre) {
      const list = genre.split(",").map((s) => s.trim()).filter(Boolean);
      if (list.length === 1) filter.genres = list[0];
      else filter.genres = { $in: list };
    }

    if (q && q.trim()) {
      filter.title = { $regex: q.trim(), $options: "i" };
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));
    const skip = (pageNum - 1) * limitNum;

    const sortObj = (sort || "")
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean)
      .reduce<Record<string, 1 | -1>>((acc, key) => {
        if (key.startsWith("-")) acc[key.slice(1)] = -1;
        else acc[key] = 1;
        return acc;
      }, {});

    const [items, total] = await Promise.all([
      MovieModel.find(filter).sort(sortObj).skip(skip).limit(limitNum).lean(),
      MovieModel.countDocuments(filter),
    ]);

    res.json({
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
      items,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Server error" });
  }
});
router.get('/:id',requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const movie = await MovieModel.findOne({id}).lean(); 
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.json(movie);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Server error" });
  } 
});
router.patch('/:id',requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const movie = await MovieModel.findOneAndUpdate({id}, updates, { new: true }).lean();
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.json({ message: "Movie updated", movie });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Server error" });
  }
});
router.delete('/:id',requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const movie = await MovieModel.findOneAndDelete({id}).lean(); 
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.json({ message: "Movie deleted", movie });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Server error" });
  }
});
export default router;
