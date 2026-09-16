import Link from "next/link";
import React, { useState } from "react";

const NoteForm = ({ edit, onSubmit, item }) => {
  const { title: editTitle, content: editContent } = item;

  const [title, setTitle] = useState(editTitle || "");
  const [content, setContent] = useState(editContent || "");

  const titleChangeHandler = (event) => {
    setTitle(event.target.value);
  };

  const contentChangeHandler = (event) => {
    setContent(event.target.value);
  };

  const addNoteHandler = (event) => {
    event.preventDefault();

    const newNote = {
      title,
      content,
    };

    onSubmit(newNote);

    setContent("");
    setTitle("");
  };

  return (
    <div className="form-container">
      <form
        onSubmit={addNoteHandler}
        className="border-2 border-lime-500 rounded-lg shadow"
      >
        <div>
          <input
            className="form-inputs h-10  bg-neutral-200 "
            type="text"
            id="title"
            name="title"
            value={title}
            placeholder="Set a Title..."
            minLength={1}
            onChange={titleChangeHandler}
            required
          />
        </div>
        <div>
          <textarea
            className="form-inputs bg-neutral-100 "
            rows={10}
            id="content"
            name="content"
            value={content}
            placeholder="Your new note here..."
            onChange={contentChangeHandler}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn-add">
          {edit ? "Edit" : "Add"}
        </button>
        {edit && (
          <Link href="/">
            <button type="button" className="btn-cancel ">
              Cancel
            </button>
          </Link>
        )}
      </form>
    </div>
  );
};

export default NoteForm;
