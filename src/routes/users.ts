import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "List of users" });
});

router.post("/", (req, res) => {
  const { name } = req.body;
  res.json({ message: `User ${name} created successfully` });
});

export default router;
