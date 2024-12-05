import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import database from "#utils/database-generator.js";
import authenticator from "#utils/authenticator.js";

const router = Router({ mergeParams: true });

router.get("/", async (request: Request<{ gamePageID: string; runID: string }>, response: Response) => {
    const { gamePageID, runID } = request.params;

    let gamePageObjectID;
    let runObjectID;

    try {
        gamePageObjectID = new ObjectId(gamePageID);
        runObjectID = new ObjectId(runID);
    } catch (error) {
        return response.status(404).json({ message: "Invalid game page ID or run ID." });
    }

    try {
        const run = await database.collection("runs").findOne({
            gamePageID: gamePageObjectID,
            _id: runObjectID
        });

        if (!run) {
            return response.status(404).json({ message: "Run not found." });
        }

        return response.json(run);
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: "Internal server error. Sowwy!" });
    }
});

router.delete("/", authenticator);
router.delete("/", async (request: Request<{ gamePageID: string; runID: string }>, response) => {

  // Confirm that the run ID is valid.
  let runID;
  let gamePageID;

  try {

    runID = new ObjectId(request.params.runID);
    gamePageID = new ObjectId(request.params.gamePageID);

  } catch (error: unknown) {

    return response.status(404).json({
      message: "Run not found."
    });

  }

  // Verify that the run exists.
  const runsCollection = database.collection("runs");
  const runFilter = {
    _id: runID,
    gamePageID
  };
  const runCount = await runsCollection.countDocuments(runFilter);

  if (runCount == 0) {

    return response.status(404).json({
      message: "Run not found."
    });

  }

});

export default router;