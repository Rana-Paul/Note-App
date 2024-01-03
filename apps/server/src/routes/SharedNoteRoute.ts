import { Router } from "express";
import { recivedSharedNotes, shareNote } from "../controllers/SharedNote";
import { authMiddleware } from "../middleware/authMiddleware";
const shareNoteRouter = Router();

shareNoteRouter.post("/:sharingNoteId", authMiddleware, shareNote);
shareNoteRouter.get("/recivedNotes", authMiddleware, recivedSharedNotes);

export default shareNoteRouter;
