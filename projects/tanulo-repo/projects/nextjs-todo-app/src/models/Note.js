import mongoose from "mongoose";

const Schema = mongoose.Schema;

const NoteSchema = new Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Note = mongoose.models.Note || mongoose.model("Note", NoteSchema);

export default Note;
