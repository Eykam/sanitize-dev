import React, { useState } from "react";
import { useAppSelector } from "../../../../../store/store";
import { FixedSizeList as List } from "react-window";
import ResultsWord from "./resultsWord";
import { Paper, Box } from "@mui/material";
import ResultTimestamps from "./resultTimestamps";

const CensoredResults = () => {
  const [focusedWord, setFocusedWord] = useState("");
  const removed = useAppSelector((state) => {
    let data = state.data.censorship.censorList;
    if (data) return data;
    else return {};
  });

  const focusWord = (word: string) => {
    setFocusedWord(word);
  };

  const checkBrowser = () => {
    return window.innerWidth <= 1500;
  };

  const checkMobile = () => {
    return window.innerWidth <= 1200;
  };

  const rows = ({
    data,
    index,
    style,
  }: {
    data: string[];
    index: number;
    style: React.CSSProperties;
  }) => {
    return (
      <div style={style}>
        <ResultsWord
          data={data}
          index={index}
          displayWord={focusWord}
          focusedWord={focusedWord}
        />
      </div>
    );
  };

  return (
    <Paper
      style={{
        color: "lightgray",
        background: "none",
        boxShadow: "none",
        height: "100%",
      }}
    >
      <Paper
        style={{
          display: "inline-block",
          height: checkMobile() ? "22vh" : "30%",
          width: "98%",
          background: "rgb(70, 70, 70)",
          color: "lightgray",
          padding: "1%",
          marginBottom: "2%",
        }}
      >
        <ResultTimestamps word={focusedWord} />
      </Paper>

      <Paper
        style={{
          display: "inline-block",
          width: "96%",
          height: "61%",
          verticalAlign: "top",
          background: "rgb(70, 70, 70)",
          color: "lightgray",
          padding: "2%",
        }}
      >
        <h4 style={{ padding: "0", margin: "0", marginBottom: "1%" }}>
          Censored Words
        </h4>

        <List
          height={checkBrowser() ? 300 : 350}
          width="100%"
          itemCount={Object.keys(removed).length}
          itemSize={25}
          itemData={Object.keys(removed).sort()}
        >
          {rows}
        </List>
      </Paper>
    </Paper>
  );
};

export default CensoredResults;
