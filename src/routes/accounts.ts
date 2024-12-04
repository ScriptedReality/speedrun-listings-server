import database from "#utils/database-generator.js";
import { Router } from "express";

const router = Router();

router.post("/", async (request, response) => {

  // Verify that an email address, username, and password were provided. 
  const {emailAddress, username, password} = request.body;
  if (!emailAddress || !username || !password) {

    return response.status(400).json({
      message: `A${!emailAddress ? "n email address" : (!username ? " username" : " password")} is required to create an account.`
    });

  }

  // Ensure that there isn't another user with the same username.
  const accountsCollection = database.collection("accounts");
  const conflictCount = await accountsCollection.countDocuments({
    username: new RegExp(username, "i")
  });

  if (conflictCount > 0) {

    return response.status(409).json({
      message: "That username is currently being used."
    });

  }

});

export default router;