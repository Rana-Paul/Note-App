import { Request, Response } from "express";
import { prismaClient } from "../db";

export const getAllNotes = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      error: "User not found",
    });
  }
  try {
    // Get all notes
    const notes = await prismaClient.note.findMany({
      where: {
        userId: req.user?.id,
      },
    });

    return res.status(200).json({
      notes,
    });
  } catch (error) {
    return res.status(500).json({
      error: "There was an error while fetching the notes",
    });
  }
};
export const getOneNote = async (req: Request, res: Response) => {
  const noteId: string = req.params.getOneNoteId;
  if (!noteId) {
    return res.status(499).json({
      error: "Note id is required",
    });
  }
  if (!req.user) {
    return res.status(401).json({
      error: "User not found",
    });
  }
  try {
    // Ensure the user deleting the note is the owner
    const isUsersNote = await prismaClient.note.findFirst({
      where: {
        id: noteId,
        userId: req.user?.id,
      },
    });

    // User is not the owner
    if (!isUsersNote) {
      return res.status(403).json({
        error: "You are not the owner of this note OR note not is not exist",
      });
    }

    // Final response
    return res.status(200).json({
      note: isUsersNote,
    });
  } catch (error) {
    return res.status(500).json({
      error: "There was an error while fetching the note",
    });
  }
};

export const addNote = async (req: Request, res: Response) => {
  const title: string = req.body.title;
  const content: string = req.body.content;
  if (!title || !content) {
    return res.status(499).json({
      error: "Something is missing",
    });
  }
  // Check if user exists
  if (!req.user) {
    return res.status(401).json({
      error: "User not found",
    });
  }
  try {
    // Create new note
    const newNote = await prismaClient.note.create({
      data: {
        title,
        content,
        userId: req.user?.id,
      },
    });

    return res.status(200).json({
      message: newNote,
    });
  } catch (error) {
    return res.status(500).json({
      error: "There was an error while creating the note",
    });
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  const noteId: string = req.params.deleteNoteId;
  if (!noteId) {
    return res.status(499).json({
      error: "Note id is required",
    });
  }

  if (!req.user) {
    return res.status(404).json({
      error: "User not found",
    });
  }

  try {
    // Ensure the user deleting the note is the owner
    const isUsersNote = await prismaClient.note.findFirst({
      where: {
        id: noteId,
        userId: req.user?.id,
      },
    });

    // User is not the owner
    if (!isUsersNote) {
      return res.status(403).json({
        error: "You are not the owner of this note",
      });
    }

    // Delete the note
    await prismaClient.note.delete({
      where: {
        id: noteId,
      },
    });

    // Final response
    return res.status(200).json({
      message: "Note Deleted",
    });
  } catch (error) {
    return res.status(500).json({
      error: "There was an error while deleting the note",
    });
  }
};

export const updateNote = async (req: Request, res: Response) => {
  const noteId: string = req.params.updateNoteId as string;
  const title: string = req.body.title;
  const content: string = req.body.content;
  if (!noteId || !title || !content) {
    return res.status(400).json({
      error: "Something is missing",
    });
  }

  if (!req.user) {
    return res.status(404).json({
      error: "User not found",
    });
  }

  try {
    // Ensure the user deleting the note is the owner
    const isUsersNote = await prismaClient.note.findFirst({
      where: {
        id: noteId,
        userId: req.user?.id,
      },
    });

    // User is not the owner
    if (!isUsersNote) {
      return res.status(403).json({
        error: "You are not the Woner of this Note",
      });
    }

    // Update the note
    await prismaClient.note.update({
      where: {
        id: noteId,
      },
      data: {
        title,
        content,
      },
    });

    // Final response
    return res.status(200).json({
      message: "Note Updated",
    });
  } catch (error) {
    return res.status(500).json({
      error: "There was an error while updating the Note",
    });
  }
};

export const searchNote = async (req: Request, res: Response) => {
  console.log("geree");
  
  const query: string = req.query.q as string;
  console.log(query);
  
  if (!query) {
    return res.status(499).json({
      error: "Query is missing",
    });
  }

  if (!req.user) {
    return res.status(404).json({
      error: "User not found",
    });
  }

  try {

    // Get notes that contains the query
    const notes = await prismaClient.note.findMany({
      where: {
        AND: [
          { userId: req.user?.id },
          {
            title: { contains: query, mode: "insensitive" },
          },
        ],
      },
    });

    return res.status(200).json({
      notes,
    })
  } catch (error) {
    return res.status(500).json({
      error: "There was an error while Searching the notes",
    });
  }
};
