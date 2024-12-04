import database from "#utils/database-generator.js";
import { Router } from "express";
import { verify as verifyPassword } from "argon2";

const router = Router();

router.post("/", async (request, response) => {

  // Verify that the user provides a valid username and password.
  const {username, password} = request.body;
  if (typeof(username) !== "string") {

    return response.status(400).json({
      message: "Username must be a string."
    });

  } else if (typeof(password) !== "string") {

    return response.status(400).json({
      message: "Password must be a string."
    });

  } else if (!username.trim() || !password) {

    return response.status(400).json({
      message: `A ${username ? "password" : "username"} is required.`
    });

  }

  const userData = await database.collection("accounts").findOne({
    username: new RegExp(username, "i")
  });

  if (!userData || await verifyPassword(userData.password, password)) {

    return response.status(401).json({
      message: "Incorrect username or password."
    });

  }

});

export default router;