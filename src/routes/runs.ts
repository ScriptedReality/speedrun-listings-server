import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import database from "#utils/database-generator.js";

const router = Router();

router.post("/:gamePageID", async (request: Request<{ gamePageID: string }>, response: Response) => {
  const { gamePageID } = request.params;
  const { time, youtubeVideo } = request.body;

  
  let objectID;
  try {
    objectID = new ObjectId(gamePageID);
  } catch (error) {
    return response.status(404).json({ message: "Game page not found." });
  }

  // Verify that the user provides a valid time
  if (!time || typeof time !== "number" || time <= 0) {
    return response.status(400).json({ message: "Invalid time provided." });
  }

  // Verify that the user provides a valid YouTube video URL
  const youtubeRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
  if (!youtubeVideo || typeof youtubeVideo !== "string" || !youtubeRegex.test(youtubeVideo)) {
    return response.status(400).json({ message: "Invalid YouTube video URL." });
  }

  try {
    // Try to create a new run entry in the database
    const result = await database.collection("runs").insertOne({ gamePageID: objectID, time, youtubeVideo });
    // Return a 201 status code on success, along with the run ID
    return response.status(201).json({ id: result.insertedId });
  } catch (error) {
    console.error(error);
    // Return a 500 error if the database operation fails
    return response.status(500).json({ message: "Internal server error." });
  }
});

export default router;