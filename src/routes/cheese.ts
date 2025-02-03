import { Router } from "express";
import KaasNLService from "../services/KaasNLService";

const router = Router();

// router.get("/", (req, res) => {
//   res.json({ message: "List of users" });
// });

export interface CheeseResult {
  name: string;
  flavorIntensity?: 1 | 2 | 3 | 4 | 5;
  tasteCategories?: string[];
  description: string;
  productInfo?: {
    origin?: string;
    milkType?: string;
    brand?: string;
    organic?: boolean;
    allergens?: string;
    edibleRind?: boolean;
    vegetarian?: boolean;
    rawMilk?: boolean;
  };
}

export interface CheeseSearchResult {
  name: string;
  image?: string;
  flag?: string;
  url?: string;
}

router.get("/kaasnl", async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) throw new Error("No URL provided");
    const vivinoService = new KaasNLService();
    const recipeData = await vivinoService.getProductData(url as string);
    // log(recipeData);
    res.json(recipeData);
  } catch (e: any) {
    console.log(e);
    res.json({ error: e.message });
  }
});

router.get("/kaasnl/search", async (req, res, log) => {
  try {
    const query = req.query.query;
    if (!query) throw new Error("No query provided");
    const vivinoService = new KaasNLService();
    const recipeData = await vivinoService.searchData(query as string);
    // log(recipeData);
    res.json(recipeData);
  } catch (e: any) {
    console.log(e);
    res.json({ error: e.message });
  }
});

export default router;
