import { Router } from "express";
import { getRankingController } from "../controllers/rankingController.js";

const router = Router();

router.get("/", getRankingController);

export default router;
