import express, { Request, Response } from "express";
import { ListModel } from "../models/listModel.js";
import { requireAuth } from "../middleware/auth.js";
const router = express.Router();
router.post("/",requireAuth, async (req: Request, res: Response) => {
  try {
    const {id, movieId, list, rating } = req.body;
    const entry = new ListModel({
        id,
        movieId,
        list,
        rating,
    });
    await entry.save();
    res.status(201).json({ message: " List entry added:", entry });
  }
    catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
router.get("/",requireAuth, async (req: Request, res: Response) => {
  try {
    const { 
        list,
        page = "1",
        limit = "20", 
        sort = "-id" 
    } = req.query as Record<string, string>;
    const filter: Record<string, any> = {};
    if (list) filter.list = list;
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
    }
    , {});
    const entries = await ListModel.find(filter).sort(sortObj).skip(skip).limit(limitNum);
    const total = await ListModel
        .find(filter)
        .countDocuments();
    res.json({ page: pageNum, total, entries });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
router.patch("/:id",requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const entry = await ListModel.findOneAndUpdate(
        { id: Number(id) },
        updateData,
        { new: true }
    );
    if (!entry) {
      return res.status(404).json({ error: "List entry not found"});
    }
    res.json({ message: " List entry updated", entry });
    } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
    }
});
router.delete("/:id",requireAuth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const entry = await ListModel.findOneAndDelete({ id: Number(id) });
        if (!entry) {
            return res.status(404).json({ error: "List entry not found" });
        }
        res.json({ message: " List entry deleted", entry });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});
export default router;