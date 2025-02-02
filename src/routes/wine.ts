import { log } from "console";
import { Router } from "express";
import VivinoService from "../services/VivinoService";

const router = Router();

// router.get("/", (req, res) => {
//   res.json({ message: "List of users" });
// });

router.get("/vivino", async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) throw new Error("No URL provided");
    const vivinoService = new VivinoService();
    const recipeData = await vivinoService.getWineData(url as string);
    // log(recipeData);
    res.json(recipeData);
  } catch (e: any) {
    log(e);
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
    log(e);
    res.json({ error: e.message });
  }
});

export default router;
