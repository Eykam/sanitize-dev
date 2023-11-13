import React from "react";
import "../../../css/manualResults.css";
import WordSelector from "./uncensoredSelector";
import SelectedWords from "./censoredSelector";
import { Box, Paper, Tabs, Tab } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useRef, useState } from "react";
import { Callers } from "./wordCard";
import { updateFocusedWord } from "../../../../../store/features/formSlice";
import { useAppDispatch } from "../../../../../store/store";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const SelectorContainer = ({
  mobile,
  currWords,
  displayWord,
}: {
  mobile: boolean;
  currWords: {
    [index: string]: number[][];
  } | null;
  displayWord: (curr: string, caller: string) => void;
}) => {
  console.log("WordsContainer Re-Render");
  const dispatch = useAppDispatch();

  const [value, setValue] = React.useState(0);
  const [highlighted, setHighlighted] = useState("");

  const hideWordSelectors = (container: string) => {
    if (container === "transcribed") {
      const transcribedInput = document.getElementById(
        "transcribed-checkbox"
      ) as HTMLInputElement;
      const transcribedExpanded = document.getElementById(
        "word-selector"
      ) as HTMLDivElement;
      const transcribedExpander = document.getElementById(
        "transcribed-show"
      ) as HTMLSpanElement;
      const transcribedOuter = document.getElementById(
        "transcribed-words"
      ) as HTMLDivElement;

      if (transcribedInput.checked) {
        transcribedExpanded.style.display = "none";
        transcribedExpander.innerText = "[+]";
        // transcribedOuter.style.height = "4vh";
      } else {
        transcribedExpanded.style.display = "block";
        transcribedExpander.innerText = "[-]";
        transcribedOuter.style.height = "auto";
      }
    } else if (container === "selected") {
      const selectedInput = document.getElementById(
        "selected-checkbox"
      ) as HTMLInputElement;
      const selectedExpanded = document.getElementById(
        "selected-words"
      ) as HTMLDivElement;
      const selectedExpander = document.getElementById(
        "selected-show"
      ) as HTMLSpanElement;
      const selectedOuter = document.getElementById(
        "selected-words-outer"
      ) as HTMLDivElement;

      if (selectedInput.checked) {
        selectedExpanded.style.display = "none";
        selectedExpander.innerHTML = "[+]";
        // selectedOuter.style.height = "auto";
      } else {
        selectedExpanded.style.display = "block";
        selectedExpander.innerText = "[-]";
        selectedOuter.style.height = "auto";
      }
    }
  };

  const focusWord = (currWord: string, caller: string) => {
    displayWord(currWord, caller);
    console.log("focusing on ", caller);
    setHighlighted(caller);
    dispatch(updateFocusedWord({ word: currWord, caller: caller }));
  };

  const CustomTabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <>{children}</>}
      </div>
    );
  };

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return mobile ? (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          style={{ color: "lightgray" }}
          variant="fullWidth"
          TabIndicatorProps={{
            sx: { backgroundColor: "lightgray" },
          }}
        >
          <Tab label="Words" {...a11yProps(0)} style={{ color: "lightgray" }} />
          <Tab
            label="To Censor"
            {...a11yProps(1)}
            style={{ color: "lightgray" }}
          />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        <Box style={{ height: "50vh" }}>
          <Paper
            id="transcribed-words"
            className=" manual-inner"
            style={{
              background: "none",
              color: "lightgray",
              margin: "0",
              padding: "0",
              boxShadow: "none",
            }}
          >
            <div style={{ padding: "4%" }}>
              {currWords != null ? (
                <WordSelector
                  originalEntries={currWords}
                  displayWord={focusWord}
                />
              ) : (
                <></>
              )}
            </div>
          </Paper>
        </Box>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <Box style={{ height: "50vh" }}>
          <Paper
            id="selected-words-outer"
            className=" manual-inner"
            style={{
              margin: "0",
              padding: "0",
              background: "none",
              color: "lightgray",
              boxShadow: "none",
            }}
          >
            <div style={{ padding: "4%" }}>
              <SelectedWords displayWord={focusWord} />
            </div>
          </Paper>
        </Box>
      </CustomTabPanel>
    </>
  ) : (
    <>
      <Box gridColumn="span 1">
        <Paper
          id="transcribed-words"
          className=" manual-inner"
          style={{
            background: "rgb(70, 70, 70)",
            color: "lightgray",
            margin: "0",
            padding: "0",
            border:
              highlighted === Callers.suggested ||
              highlighted === Callers.unselected
                ? "solid 2px rgb(50, 50, 50)"
                : "none",
          }}
        >
          <div id="words" style={{ padding: "4%" }}>
            <b>WORDS</b>
            <label style={{ float: "right", fontSize: "100%", padding: "1px" }}>
              <input
                type="checkbox"
                id="transcribed-checkbox"
                style={{ display: "none" }}
                onClick={() => {
                  hideWordSelectors("transcribed");
                }}
              />
              <span className="expander" id={"transcribed-show"}>
                [-]
              </span>
            </label>
            {currWords != null ? (
              <WordSelector
                originalEntries={currWords}
                displayWord={focusWord}
              />
            ) : (
              <></>
            )}
          </div>
        </Paper>
      </Box>
      <Box gridColumn="span 1">
        <Paper
          id="selected-words-outer"
          className=" manual-inner"
          style={{
            margin: "0",
            padding: "0",
            background: "rgb(70, 70, 70)",
            color: "lightgray",
            border:
              highlighted === Callers.selected
                ? "solid 2px rgb(50, 50, 50)"
                : "none",
          }}
        >
          <div style={{ padding: "4%" }}>
            <b>TO CENSOR</b>

            <label
              style={{
                fontSize: "100%",
                padding: "1px",
                float: "right",
              }}
            >
              <input
                type="checkbox"
                id="selected-checkbox"
                style={{ display: "none" }}
                onClick={() => {
                  hideWordSelectors("selected");
                }}
              />
              <span
                className="expander"
                id="selected-show"
                style={{ marginLeft: "auto" }}
              >
                [-]
              </span>
            </label>

            <SelectedWords displayWord={focusWord} />
          </div>
        </Paper>
      </Box>{" "}
    </>
  );
};

export default SelectorContainer;
