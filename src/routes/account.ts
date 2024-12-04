import { Router } from "express";
import sessionsRouter from "./account/sessions.js";

const router = Router();
router.use("/sessions", sessionsRouter);

export default router;