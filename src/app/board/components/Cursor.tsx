import React, { useMemo } from "react";
import { cursorColors } from "@/data/cursorColors";

const Cursor = () => {
  const cursorColor = useMemo(() => {
    const index = Math.floor(Math.random() * cursorColors.length);

    return cursorColors[index];
  }, []);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill={cursorColor}
      viewBox="0 0 16 16"
      style={{
        transform: "rotate(270deg)",
      }}
    >
      <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
    </svg>
  );
};

export default Cursor;
