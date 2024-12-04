import database from "#utils/database-generator.js";
import { Router } from "express";
import { verify as verifyPassword } from "argon2";
import { randomBytes } from "crypto";
import { Collection, ObjectId } from "mongodb";

const router = Router({mergeParams: true});

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
  const sessionData = {
    token: sessionToken,
    creationDate,
    creationIP: request.socket.remoteAddress,
    expirationDate
  };

  try {
    
    const { insertedId: sessionID } = await database.collection("sessions").insertOne(sessionData);

    await accountsCollection.updateOne(userFilter, {
      $push: {
        sessionIDs: sessionID
      }
    });

  } catch (error: unknown) {

    console.error(error);

    return response.status(500).json({
      message: "Something bad happened on our side. Try again later."
    });

  }

  // Return a 201 success, and a JSON response body with the session data.
  return response.status(201).json(sessionData);

});

export default router;