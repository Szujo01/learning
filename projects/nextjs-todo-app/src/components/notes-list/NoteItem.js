import React from "react";
import { SlOptionsVertical } from "react-icons/sl";
import NoteDropDownMenu from "./NoteDropDownMenu";
import { useRouter } from "next/router";

const NoteItem = ({ item }) => {
  const { createdAt, title, content, id } = item;
  const router = useRouter();

  const dateString = new Date(createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const dateComponents = dateString.split(" ");
  const day = dateComponents[0];
  const month = dateComponents[1];
  const year = dateComponents[2].slice(2);

  const deleteNote = async () => {
    const proceed = window.confirm(
      "Are you sure you wish to delete this task?"
    );

    if (proceed) {
      const response = await fetch("/api/notes/" + id, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("unable to delete note");
      }

      console.log(response);
    }

    router.reload();
  };

  return (
    <li className="list-item">
      <div className="text-center mx-auto col-span-1">
        <div className="bg-black mx-auto pt-1 w-20 h-16 text-white text-5xl border-4 rounded-xl border-green-500">
          {day}
        </div>
        <div className="font-semibold pt-1">
          {month}&apos;{year}
        </div>
      </div>
      <div className="w-2/3 pr-3">
        <div className="font-semibold uppercase ">{title}</div>
        <div className="pt-2 md:break-all md:break-words">{content}</div>
      </div>
      <div className="dropdown absolute top-0 right-0 mt-3 mr-2 ">
        <SlOptionsVertical size={25} className="cursor-pointer" />
        <NoteDropDownMenu onDelete={deleteNote} id={id} />
      </div>
    </li>
  );
};

export default NoteItem;
