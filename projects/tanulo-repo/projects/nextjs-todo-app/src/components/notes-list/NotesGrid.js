import React from "react";
import NoteItem from "./NoteItem";
import SortButton from "../UI/SortButton";

const NotesGrid = ({ notes, order, onSubmit }) => {
  const arrangeNotesHandler = (order) => {
    onSubmit();
  };

  return (
    <>
      <div className="flex w-3/4 justify-end">
        <SortButton order={order} onSubmit={arrangeNotesHandler} />
      </div>
      <ul className="container my-4 p-4 w-2/3 mx-auto">
        {notes.map((note) => (
          <NoteItem key={note.id} item={note} />
        ))}
      </ul>
    </>
  );
};

export default NotesGrid;
