import mongoose from "mongoose";

import "dotenv/config";

const DB_URI = process.env.DB_URI!;
const DB_NAME = process.env.DB_NAME!;

export async function connectDb() {
  return mongoose.connect(DB_URI, {
    dbName: DB_NAME,
  });
}
