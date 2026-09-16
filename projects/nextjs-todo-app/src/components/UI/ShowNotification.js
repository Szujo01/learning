import React from "react";

const ShowNotification = ({ message, isError }) => {
  let bgColor = "bg-green-400";

  if (isError) {
    bgColor = "bg-red-400";
  }

  return (
    <div className={`fixed bottom-0 left-0 w-full text-center ${bgColor} p-3`}>
      {message}
    </div>
  );
};

export default ShowNotification;
