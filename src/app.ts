import express from "express";
import accountsRouter from "./routes/accounts.js";
import runsRouter from "./routes/runs.js";
import gamePagesRouter from "./routes/game-pages.js";
import cors from "cors";
import { MongoClient } from "mongodb";

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.disable("x-powered-by");
app.use("/runs", runsRouter);
app.use("/accounts", accountsRouter);
app.use("/game-pages", gamePagesRouter);

app.get("/", (_, response) => response.json({success: true}));

const port = process.env.PORT;
app.listen(port, () => console.log(`\x1b[32mNow listening on port ${port}.\x1b[0m`));
