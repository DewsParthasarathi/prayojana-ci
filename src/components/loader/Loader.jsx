import React from "react";

const Loader = ({ loading = true }) => {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div
          className="h-4 w-4 rounded-full bg-blue-600 animate-pulse"
          style={{ animationDelay: "0ms" }}
        ></div>

        <div
          className="h-4 w-4 rounded-full bg-blue-600 animate-pulse"
          style={{ animationDelay: "200ms" }}
        ></div>

        <div
          className="h-4 w-4 rounded-full bg-blue-600 animate-pulse"
          style={{ animationDelay: "400ms" }}
        ></div>
      </div>
    </div>
  );
};

export default Loader;
