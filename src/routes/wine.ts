import { Router } from "express";
import VivinoService from "../services/VivinoService";

const router = Router();

export interface WineSearchResult {
  id: string;
  name: string;
  url: string;
  image?: string;
  description?: string;
  rating?: {
    average: number;
    count?: number;
  };
  brand?: {
    id: string;
    name?: string;
    url?: string;
  };
}

export interface WineResult {
  id: string;
  name: string;
  description?: string;
  url?: string;
  website?: string;
  images?: string[];
  rating?: {
    average: number;
    count?: number;
  };
  price?: {
    amount?: number;
    currency: string;
    low?: number;
    high?: number;
  };
  brand?: {
    id: string;
    name?: string;
    url?: string;
  };
  taste: any;
  raw?: any;
}

// router.get("/", (req, res) => {
//   res.json({ message: "List of users" });
// });

router.get("/vivino", async (req, res) => {
  try {
    const url = req.query.url;
    const debug =
      typeof req.query.debug === "string" &&
      req.query.debug.toLowerCase() === "true";
    if (!url) throw new Error("No URL provided");
    const vivinoService = new VivinoService();
    const recipeData = await vivinoService.getWineData(url as string, {
      debug,
    });
    // log(recipeData);
    res.json(recipeData);
  } catch (e: any) {
    console.error(e);
    res.json({ error: e.message });
  }
});

router.get("/vivino/search", async (req, res, log) => {
  try {
    const query = req.query.query;
    if (!query) throw new Error("No query provided");
    const vivinoService = new VivinoService();
    const recipeData = await vivinoService.searchWine(query as string);
    // log(recipeData);
    res.json(recipeData);
  } catch (e: any) {
    console.error(e);
    res.json({ error: e.message });
  }
});

export default router;
