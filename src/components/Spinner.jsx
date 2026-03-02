import React from "react";

const Spinner = ({ fullScreen = false }) => {
  return (
    <div
      className={`flex justify-center items-center ${fullScreen ? "h-screen" : "py-10"}`}
    >
      <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 border-solid border-green-600 rounded-full border-t-transparent"></div>
    </div>
  );
};

export default Spinner;
