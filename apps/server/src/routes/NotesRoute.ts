import {Router} from "express";
import { addNote, deleteNote, getAllNotes, getOneNote, searchNote, updateNote } from "../controllers/Notes";
import { authMiddleware } from "../middleware/authMiddleware";
const notesRouter = Router();

notesRouter.get("/getAllNotes",authMiddleware,getAllNotes);
notesRouter.get("/:getOneNoteId",authMiddleware,getOneNote);
notesRouter.get("/search",authMiddleware,searchNote);

notesRouter.post("/addNote",authMiddleware,addNote);
notesRouter.put("/:updateNoteId",authMiddleware,updateNote);
notesRouter.delete("/:deleteNoteId",authMiddleware,deleteNote);

export default notesRouter