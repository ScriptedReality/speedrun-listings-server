import { Router } from "express";
import gamePageIDRouter from "./game-pages/[gamePageID].js"

const router = Router();
router.use("/:gamePageID", gamePageIDRouter);

export default router;