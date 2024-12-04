import database from "#utils/database-generator.js";
import { Router } from "express";
import { verify as verifyPassword } from "argon2";
import { randomBytes } from "crypto";
import { Collection, ObjectId } from "mongodb";

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

  const accountsCollection: Collection<{
    username: string;
    password: string;
    sessionIDs: ObjectId[]
  }> = database.collection("accounts");
  const userFilter = {
    username: new RegExp(username, "i")
  };
  const userData = await accountsCollection.findOne(userFilter);

  if (!userData || await verifyPassword(userData.password, password)) {

    return response.status(401).json({
      message: "Incorrect username or password."
    });

  }

  // Create a random hashed token and save it to the user's profile in the database.
  const sessionToken = randomBytes(64).toString("hex");
  const creationDate = new Date();
  const expirationDate = creationDate;
  expirationDate.setDate(creationDate.getDate() + 30);
  
  const {insertedId} = await database.collection("sessions").insertOne({
    token: sessionToken,
    creationDate,
    creationIP: request.socket.remoteAddress,
    expirationDate
  });

  await accountsCollection.updateOne(userFilter, {
    $push: {
      sessionIDs: insertedId
    }
  });

});

export default router;