import {Router} from "express";
import { addNote, deleteNote, getAllNotes, updateNote } from "../controllers/Notes";
import { authMiddleware } from "../middleware/authMiddleware";
const notesRouter = Router();

notesRouter.get("/getAllNotes",authMiddleware,getAllNotes);
notesRouter.get("/addNote",authMiddleware,addNote);
notesRouter.get("/deleteNote",authMiddleware,deleteNote);
notesRouter.get("/updateNote",authMiddleware,updateNote);

export default notesRouter