import React from "react";
import Link from "next/link";

const NoteDropDownMenu = ({ onDelete, id }) => {
  const deleteHandler = () => {
    onDelete();
  };

  return (
    <ul className="dropdown-menu absolute hidden text-gray-700 pt-1">
      <li>
        <Link
          className="rounded-t bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap"
          href={`/${id}`}
        >
          Edit
        </Link>
      </li>
      <li
        className="bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap"
        onClick={deleteHandler}
      >
        Delete
      </li>
    </ul>
  );
};

export default NoteDropDownMenu;
