import { Router } from "express";
import cheeseRoutes from "./cheese";
import golfRoutes from "./golf";
import userRoutes from "./users";
import wineRoutes from "./wine";

const router = Router();

router.use("/users", userRoutes);
router.use("/wine", wineRoutes);
router.use("/cheese", cheeseRoutes);
router.use("/golf", golfRoutes);

export default router;
