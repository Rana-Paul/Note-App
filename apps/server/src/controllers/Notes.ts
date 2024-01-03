import { Request, Response } from "express";
import { prismaClient } from "../db";

export const getAllNotes = async (req: Request, res: Response) => {
  try {
    console.log(req.user?.id);

    const notes = await prismaClient.note.findMany({
      where: {
        userId: req.user?.id,
      },
    });

    return res.status(200).json({
      notes,
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

export const addNote = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Invalid Request",
    });
  }

  const title: string = req.body.title;
  const content: string = req.body.content;

  const newNote = await prismaClient.note.create({
    data: {
      title,
      content,
      userId: req.user?.id,
    },
  });
};

export const deleteNote = async (req: Request, res: Response) => {
  const noteId: string = req.body.noteId;

  const isUsersNote = await prismaClient.note.findFirst({
    where: {
      id: noteId,
      userId: req.user?.id,
    },
  });

  if (!isUsersNote) {
    return res.status(401).json({
      message: "Invalid Request",
    });
  }

  await prismaClient.note.delete({
    where: {
      id: noteId,
    },
  });

  return res.status(200).json({
    message: "Note Deleted",
  });
};

export const updateNote = async (req: Request, res: Response) => {
  const noteId: string = req.body.noteId;
  const title: string = req.body.title;
  const content: string = req.body.content;

  const isUsersNote = await prismaClient.note.findFirst({
    where: {
      id: noteId,
      userId: req.user?.id,
    },
  });

  if (!isUsersNote) {
    return res.status(401).json({
      message: "Invalid Request",
    });
  }

  await prismaClient.note.update({
    where: {
      id: noteId,
    },
    data: {
      title,
      content,
    },
  });

  return res.status(200).json({
    message: "Note Updated",
  });
};
