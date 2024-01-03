import { Request, Response } from "express";
import { prismaClient } from "../db";

// Sharing Notes
export const shareNote = async (req: Request, res: Response) => {
  const noteId: string = req.params.sharingNoteId;
  const sharedEmail = req.body.email;
  if (!noteId || !sharedEmail) {
    return res.status(401).json({
      error: "Something is missing",
    });
  }

  try {
    const note = await prismaClient.note.findUnique({
      where: {
        id: noteId,
      },
    });

    // If not is not found
    if (!note) {
      return res.status(404).json({
        error: "Note not found",
      });
    }

    // Ensure the user sharing the note is the owner
    if (note.userId !== req.user?.id) {
      return res.status(403).json({
        error: "You are not the owner of this note",
      });
    }

    // Find the user to share
    const sharedWithUser = await prismaClient.user.findUnique({
      where: {
        email: sharedEmail,
      },
    });

    // If shared user is not found
    if (!sharedWithUser) {
      return res.status(404).json({
        error: "This email is not Registered! Make sure the email is Signed up as a user",
      });
    }

    //create shared note
    const sharedNote = await prismaClient.sharedNote.create({
      data: {
        noteId: note.id,
        shared_with_user_id: sharedWithUser?.id,
      },
    })

    // Final response
    return res.status(200).json({
      message: "Note Shared Successfully",
    })
  } catch (error) {
    return res.status(401).json({
      error: "There was an error while sharing the note",
    });
  }
};

// Recived All Notes
export const recivedSharedNotes = async (req: Request, res: Response) => {
  if(!req.user) {
    return res.status(404).json({
      error: "User not found",
    });
  }

  try {
    // Get all Recived notes
    const recivedNotes = await prismaClient.sharedNote.findMany({
      where: {
        shared_with_user_id: req.user?.id
      },
      include: {
        note: true
      }
    })

    // Final response
    return res.status(200).json({
      notes: recivedNotes
    })
    
  } catch (error) {
    return res.status(500).json({
      error: "There was an error while fetching the notes",
    });
    
  }
}
