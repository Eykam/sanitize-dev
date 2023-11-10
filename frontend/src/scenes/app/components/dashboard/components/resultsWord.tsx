import React from "react";
import { useAppSelector } from "../../../../../store/store";
import { WordDetails } from "../../../../../store/features/formSlice";
import { Checkbox, Box, Paper } from "@mui/material";

const ResultsWord = ({
  data,
  index,
  focusedWord,
  displayWord,
}: {
  data: string[];
  index: number;
  focusedWord: string;
  displayWord: (word: string) => void;
}) => {
  const curr = data[index];
  //   const focusedWord = useAppSelector(
  //     (state) => state.form.focusedWord as WordDetails
  //   );
  const censorReasons = useAppSelector((state) => {
    if (
      state.data.transcription.response != null &&
      state.data.transcription.response !== undefined
    ) {
      return state.data.transcription.response.badWords;
    }
  });

  return (
    <div
      className="word-shell"
      style={{
        display: "flex",
        padding: "0.5%",
        // borderRadius: "5px",
        background: curr === focusedWord ? "rgb(125,125,125)" : "",
        borderRadius: curr === focusedWord ? "5px" : "",
      }}
      id={curr + "-outer"}
      key={curr + "-outer"}
    >
      <div
        className="collapsible"
        id={curr + "-collapsible"}
        style={{
          width: "100%",
          maxWidth: "100%",
          margin: "auto 0",
        }}
        onClick={(e) => {
          // e.stopPropagation();

          if (displayWord) displayWord(curr);
        }}
      >
        <div
          style={{
            display: "flex",
            maxWidth: "100%",
          }}
        >
          {curr}

          <span
            style={{
              display: "inline-block",
              margin: "auto 0",
              marginLeft: "auto",
              fontSize: "70%",
              color: "grey",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {"Type: "}
            {censorReasons !== undefined ? censorReasons[curr]["reason"] : ""}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResultsWord;
