import React from "react";
import NoteForm from "@/components/form/NoteForm";
import connectToDatabase from "@/utils/mongoose";
import Note from "@/models/Note";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";

const EditNote = ({ item }) => {
  const router = useRouter();

  const editNoteHandler = async (noteDetails) => {
    const response = await fetch("/api/notes/" + item.id, {
      method: "PATCH",
      body: JSON.stringify(noteDetails),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Could not update your task");
    }

    router.push("/");
  };

  return <NoteForm edit item={item} onSubmit={editNoteHandler} />;
};

export default EditNote;

export const getServerSideProps = async (context) => {
  const sess = await getServerSession(context.req, context.res, authOptions);

  if (!sess) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const { noteId } = context.query;

  await connectToDatabase();

  let note;
  try {
    note = await Note.findById(noteId);
  } catch (error) {
    throw new Error("unable to find note in DB");
  }

  const noteObject = {
    id: note._id.toString(),
    title: note.title,
    content: note.content,
  };

  return {
    props: {
      item: noteObject,
    },
  };
};
