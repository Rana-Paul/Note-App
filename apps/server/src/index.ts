import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import userRouter from "./routes/User";
import notesRouter from "./routes/Notes";
dotenv.config();

const app: Express = express();
const port = 8000;

app.use("/api/user", userRouter)
app.use("/api/note", notesRouter)

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});