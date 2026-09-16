import React from "react";

const SortButton = ({ onSubmit, order }) => {
  const sortHandler = () => {
    onSubmit();
  };

  const sortBy = order === "desc" ? "asc" : "desc";

  return (
    <button
      onClick={sortHandler}
      className="border-2 border-green-500 rounded mr-3 p-2 font-semibold text-center"
    >
      {`Sort by: ${sortBy} order`}
    </button>
  );
};

export default SortButton;
