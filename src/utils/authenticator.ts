import { NextFunction, Request, Response } from "express";
import database from "./database-generator.js";
import { verify } from "argon2";
import { ObjectId } from "mongodb";

async function authenticator(request: Request, response: Response, next: NextFunction) {

  const token = request.headers.token;
  const accountIDString = request.headers["account-id"];

  if (typeof(token) == "string" && typeof(accountIDString) == "string") {

    const accountID = new ObjectId(accountIDString);
    const sessions = await database.collection("sessions").find({accountID}).toArray();

    for (const session of sessions) {

      if (await verify(session.tokenHash, token)) {

        // Save account data.
        const accountData = await database.collection("accounts").findOne({_id: accountID});
        response.locals.accountData = accountData;

        next();
        return;

      }

    }

  }

  response.status(401).json({
    message: "Provide valid authentication token and account ID headers."
  });

}

export default authenticator;