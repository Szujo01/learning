import mongoose from "mongoose";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";

import connectToDatabase from "@/utils/mongoose";
import Note from "@/models/Note";
import User from "@/models/User";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    throw new Error("You must be logged in");
  }

  const userEmail = session.user.email;

  if (req.method === "GET") {
    const { sort } = req.query;

    await connectToDatabase();

    let currentUser;
    try {
      currentUser = await User.findOne({ email: userEmail });
    } catch (error) {
      throw new Error(error.message);
    }

    try {
      const notes = await Note.find({ user: currentUser.id }).sort({
        createdAt: sort || "desc",
      });
      res
        .status(200)
        .json({ notes: notes.map((note) => note.toObject({ getters: true })) });
    } catch (error) {
      throw new Error(error.message);
    }
  } else if (req.method === "POST") {
    await connectToDatabase();

    let currentUser;
    try {
      currentUser = await User.findOne({ email: userEmail });
    } catch (error) {
      throw new Error("Could not connect to DB");
    }

    const newNote = new Note({
      user: currentUser.id,
      title: req.body.title,
      content: req.body.content,
    });

    try {
      await newNote.save();
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await newNote.save({ session: sess });
      currentUser.notes.push(newNote);
      await currentUser.save({ session: sess });
      await sess.commitTransaction();
      res.status(201).json({ message: "newNote saved!" });
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

export default handler;
