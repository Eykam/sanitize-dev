import React from "react";
import "../css/progressBar.css";

interface Props {
  bgColor: string;
  completed: number;
}

const ProgressBar = ({ bgColor, completed }: Props) => {
  return (
    <div id="container-styles">
      <div
        id="filler-styles"
        style={{ width: `${completed}%`, backgroundColor: bgColor }}
      ></div>
    </div>
  );
};

export default ProgressBar;
