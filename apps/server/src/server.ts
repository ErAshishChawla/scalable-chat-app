import { createServer } from "http";

import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

import { apiRouter } from "./routes";

import { apiResponse } from "./utils/api-response";
import { connectDb } from "./db";

//Setting envs
import "dotenv/config";

const PORT = process.env.PORT || 3001;

// Setting up express server
const app = express();
const server = createServer(app);

// Adding standard middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN!, // Specify the exact origin
    credentials: true, // Allow credentials
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

app.use((req: Request, res: Response, next) => {
  console.log(req.path);
  console.log("Access Token from browser", req.cookies["chatapp-access-token"]);
  console.log("\n");
  console.log(
    "Refresh Token from browser",
    req.cookies["chatapp-refresh-token"]
  );
  next();
});

// Setting up api route
app.use("/api", apiRouter);

app.use((req: Request, res: Response) => {
  return res.status(404).json(apiResponse(404, "Bad Request"));
});

// DB connection
connectDb()
  .then(() => {
    console.log("Connected to DB");
    // Starting the server
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to DB", error);
    process.exit(1);
  });
