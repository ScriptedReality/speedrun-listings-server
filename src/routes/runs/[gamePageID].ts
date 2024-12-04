import { Request, Response, Router } from "express";
import database from "#utils/database-generator.js";
import { ObjectId } from "mongodb";
import runIDRouter from "./[gamePageID]/[runID].js";

const router = Router({mergeParams: true});
router.use("/:runID", runIDRouter);

router.post("/", async (request: Request<{ gamePageID: string }>, response: Response) => {
  const { gamePageID } = request.params;
  const { time, url } = request.body;

  console.log('Received body:', request.body);
  console.log('Time:', time);
  console.log(typeof url);
  let objectID;
  try {
    objectID = new ObjectId(gamePageID);
  } catch (error) {
    return response.status(404).json({ message: "Game page not found." });
  }

  // Convert time to an integer and validate
  const timeInt = parseInt(time, 10);
  if (isNaN(timeInt) || timeInt <= 0) {
    return response.status(400).json({ message: "Invalid time provided." });
  }

  // Verify that the user provides a valid YouTube video URL
  const youtubeRegex = /^(https?\:\/\/)?(www\.youtube\.com\/watch\?v=|youtu\.?be\/).+$/;
  if (!url || typeof url !== "string" || !youtubeRegex.test(url)) {
    return response.status(400).json({ message: "Invalid YouTube video URL." });
  }

  // Log the received body
  

  try {

    const createdAt = new Date();

    // Try to create a new run entry in the database
    const result = await database.collection("runs").insertOne({
      gamePageID: objectID,
      time: timeInt,
      url,
      createdAt // Add the createdAt field
    });

    // Return a 201 status code on success, along with the run ID
    return response.status(201).json({ id: result.insertedId });
  } catch (error) {
    console.error(error);
    // Return a 500 error if the database operation fails
    return response.status(500).json({ message: "Internal server error." });
  }
});

export default router;