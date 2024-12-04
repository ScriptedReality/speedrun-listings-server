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

});

export default router;