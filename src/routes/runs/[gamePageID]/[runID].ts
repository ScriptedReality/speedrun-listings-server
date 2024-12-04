import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import database from "#utils/database-generator.js";

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

export default router;