import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import database from "#utils/database-generator.js";

const router = Router({ mergeParams: true });

router.get("/:runID", async (request: Request<{ gamePageID: string; runID: string }>, response: Response) => {
  const { gamePageID, runID } = request.params;

  let gamePageObjectID;
  try {
    gamePageObjectID = new ObjectId(gamePageID);
  } catch (error) {
    return response.status(404).json({ message: "Game page not found." });
  }


  let runObjectID;
  try {
    runObjectID = new ObjectId(runID);
  } catch (error) {
    return response.status(404).json({ message: "Run not found." });
  }

  try {
    const run = await database.collection("runs").findOne({
      _id: runObjectID,
      gamePageID: gamePageObjectID
    });

    if (!run) {
      return response.status(404).json({ message: "Run not found." });
    }

    return response.json(run);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Internal server error." });
  }
});

export default router;
