import { MongoClient } from "mongodb";

const mongoClient = new MongoClient("");
const database = mongoClient.db();

export default database;