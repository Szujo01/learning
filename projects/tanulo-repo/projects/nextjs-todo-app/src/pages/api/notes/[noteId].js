import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

import connectToDatabase from "@/utils/mongoose";
import Note from "@/models/Note";
import User from "@/models/User";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    throw new Error("You must be logged in");
  }

  const userEmail = session.user.email;
  const { noteId } = req.query;

  if (req.method === "PATCH") {
    const { title, content } = req.body;

    let note;
    try {
      note = await Note.findById(noteId);
      note.title = title;
      note.content = content;
      await note.save();
    } catch (error) {
      throw new Error("could not update note");
    }

    res.status(201).json({ message: "note updated!" });
  } else if (req.method === "DELETE") {
    await connectToDatabase();

    let note;
    let user;
    try {
      note = await Note.findById(noteId);
      user = await User.findOne({ email: userEmail });
    } catch (error) {
      throw new Error("unable to find note in DB");
    }

    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      user.notes.pull(note._id);
      await user.save({ session: sess });
      await Note.deleteOne({ _id: note._id }).session(sess);
      await sess.commitTransaction();
      sess.endSession();
    } catch (error) {
      throw new Error("Unable to delete note");
    }
    res.status(201).json({ message: "task deleted" });
  }
};

export default handler;
