import { Router } from "express";
import sessionsRouter from "./account/sessions.js";
import authenticator from "#utils/authenticator.js";

const router = Router();
router.use("/sessions", sessionsRouter);

router.get("/", authenticator);
router.get("/", async (request, response) => {

  const accountData: {[key: string]: unknown} = {};

  for (const key of response.locals.accountData) {

    accountData[key === "_id" ? "accountID" : key] = response.locals.accountData[key];

  }

  response.json(accountData);

});

export default router;