import { Router } from "express";
import gamePageIDRouter from "./game-pages/[gamePageID].js";
import database from "#utils/database-generator.js";

const router = Router();
router.use("/:gamePageID", gamePageIDRouter);

router.post("/", async (request, response) => {

  const { name } = request.body;
  if (!name || typeof(name) !== "string") {

    return response.status(400).json({
      message: "A game page needs a name."
    });

  }

  if (name.length === 0 || name.length > 255) {

    return response.status(400).json({
      message: "A game page name needs to be at least 1 character and at most 255 characters."
    });

  }

  try {

    const { insertedId: gamePageID } = await database.collection("gamePages").insertOne({name});
    console.log(`Successfully created a game page: ${gamePageID}`);

    return response.status(201).json({
      id: gamePageID
    });

  } catch (error: unknown) {

    console.error(error);

    return response.status(500).json({
      message: "Something bad happened on our end. Try again later."
    });

  }

});

export default router;