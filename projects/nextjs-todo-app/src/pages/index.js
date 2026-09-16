import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import NoteForm from "@/components/form/NoteForm";
import NotesGrid from "@/components/notes-list/NotesGrid";
import ShowNotification from "@/components/UI/ShowNotification";

const HomePage = () => {
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [arrangeNotes, setArrangeNotes] = useState("desc");
  const [showStatusMessage, setShowStatusMessage] = useState(null);

  const fetchNotes = useCallback(async (order) => {
    try {
      const response = await fetch("/api/notes/?sort=" + order);

      if (!response.ok) {
        setShowStatusMessage({
          message:
            `Error: ${response.message}` ||
            "Error: Could not retrieve your tasks at the present moment",
          isError: true,
        });
        return;
      }

      const data = await response.json();
      setNotes(data.notes);
    } catch (error) {
      setShowStatusMessage({
        message:
          `Error: ${error.message}` ||
          "Error: Could not retrieve your tasks at the present moment",
        isError: true,
      });
    }
  }, []);

  useEffect(() => {
    fetchNotes(arrangeNotes);
  }, [fetchNotes, arrangeNotes, showStatusMessage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStatusMessage(null);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [showStatusMessage]);

  const addNote = (newNote) => {
    fetch("/api/notes", {
      method: "POST",
      body: JSON.stringify({
        title: newNote.title,
        content: newNote.content,
      }),
      headers: {
        "content-type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          setShowStatusMessage({
            message:
              "Error: " + response.message ||
              "Error: We could not create your task",
            isError: true,
          });
          return;
        }

        setShowStatusMessage({
          message: "Task created and added!",
          isError: false,
        });
      })

      .catch((error) => {
        setShowStatusMessage({
          message:
            "Error: " + error.message || "Error: We could not create your task",
          isError: true,
        });
      });

    fetchNotes(arrangeNotes);
  };

  const arrangeNotesHandler = () => {
    setArrangeNotes((state) => (state === "desc" ? "asc" : "desc"));
  };

  return (
    <>
      <NoteForm onSubmit={addNote} item={{ title: "", content: "" }} />
      {notes && notes.length > 0 && (
        <NotesGrid
          notes={notes}
          order={arrangeNotes}
          onSubmit={arrangeNotesHandler}
        />
      )}
      {showStatusMessage && (
        <ShowNotification
          message={showStatusMessage.message}
          isError={showStatusMessage.isError}
        />
      )}
    </>
  );
};

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

  const { query } = context;

  return {
    props: {
      searchQuery: query.search || "",
    },
  };
};

export default HomePage;
