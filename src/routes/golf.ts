import { Router } from "express";
import GolfPassService from "../services/GolfPassService";

const router = Router();

// router.get("/", (req, res) => {
//   res.json({ message: "List of users" });
// });

router.get("/golfpass", async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) throw new Error("No URL provided");
    const golfPassService = new GolfPassService();
    const recipeData = await golfPassService.getData(url as string);
    // log(recipeData);
    res.json(recipeData);
  } catch (e: any) {
    console.log(e);
    res.json({ error: e.message });
  }
});

router.get("/golfpass/search", async (req, res, log) => {
  try {
    const query = req.query.query;
    if (!query) throw new Error("No query provided");
    const golfPassService = new GolfPassService();
    const recipeData = await golfPassService.searchData(query as string);
    // log(recipeData);
    res.json(recipeData);
  } catch (e: any) {
    console.log(e);
    res.json({ error: e.message });
  }
});

export default router;
