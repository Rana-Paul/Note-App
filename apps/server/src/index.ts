import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import userRouter from "./routes/UserRoute";
import notesRouter from "./routes/NotesRoute";
import shareNoteRouter from "./routes/SharedNoteRoute";
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

app.use("/api/user", userRouter);
app.use("/api/note", notesRouter);
app.use("/api/share", shareNoteRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
