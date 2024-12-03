import { Router } from "express";
import gamePageIDRouter from "./runs/[gamePageID].js";

const router = Router();

router.use("/:gamePageID", gamePageIDRouter);

export default router;