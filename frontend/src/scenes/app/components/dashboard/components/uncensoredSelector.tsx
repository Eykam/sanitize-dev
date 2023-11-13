import React, { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../store/store";
import "../../../css/wordSelector.css";
import "../../../css/manualResults.css";
import {
  removeUnselectedWords,
  removeSuggestedWords,
  setUnselectedWords,
  resetWordList,
  addCensorWords,
} from "../../../../../store/features/dataSlice";
import {
  WordList,
  hideFormSettings,
  resetCheckLists,
  showTimestampSubmit,
  updateTimestamp,
  updateWord,
} from "../../../../../store/features/formSlice";
import { FixedSizeList as List } from "react-window";
import { Paper, Button, Checkbox, Tooltip } from "@mui/material";
import { Callers } from "./wordCard";
import WordsList from "./wordsList";
import Zoom from "@mui/material/Zoom";
//===========================================================  Interfaces ============================================================

interface WordSelectorComponents {
  originalEntries: { [index: string]: number[][] };
}

//============================================================== Utils ==============================================================

const checkBrowser = () => {
  return window.matchMedia("(max-width: 780px)").matches;
};

const checkSmaller = () => {
  return window.innerWidth <= 1500;
};

//================================================================================= React =======================================================================

const UncensoredSelector = ({
  originalEntries,
  displayWord,
}: {
  originalEntries: WordSelectorComponents["originalEntries"];
  displayWord: (word: string, caller: string) => void;
}) => {
  //============================================================== CONSTANTS & STATES ==============================================================
  const entry = useAppSelector((state) => state.data.unselectedWords);
  const suggestions = useAppSelector((state) => state.data.suggestedWords);

  const checkList = useAppSelector(
    (state) => state.form.unselectedList as WordList
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleEntry, setVisibility] = useState(Object.keys(entry));
  const [visibleSuggestion, setSuggestionVisibility] = useState(
    Object.keys(suggestions)
  );
  const [suggestionsHidden, setSuggestionsHidden] = useState(false);

  const dispatch = useAppDispatch();

  console.log("WordSelector Re-Render");

  //============================================================== UseEffects ==============================================================

  useEffect(() => {
    dispatch(setUnselectedWords({ entries: originalEntries }));
    dispatch(hideFormSettings());
    dispatch(showTimestampSubmit());
  }, [originalEntries, dispatch]);

  useEffect(() => {
    const search = async (term: string) => {
      if (term !== "") {
        setVisibility(Object.keys(entry).filter((word) => word.includes(term)));
        setSuggestionVisibility(
          Object.keys(suggestions).filter((word) => word.includes(term))
        );
      } else {
        setVisibility(Object.keys(entry));
        setSuggestionVisibility(Object.keys(suggestions));
      }
    };

    search(searchTerm);
  }, [entry, suggestions, searchTerm]);

  //============================================================== Functions ==============================================================

  const removeAllTimesWord = (
    caller: string,
    currWord: string,
    timestamps: string[]
  ): boolean => {
    let data = caller === Callers.suggested ? suggestions : entry;
    console.log("test print:", timestamps);
    console.log("test worD:", currWord);
    console.log("test1:", data);
    console.log("test2:", data[currWord]);
    return timestamps.length === data[currWord].length;
  };

  const updateStore = (
    caller: string,
    word: string,
    timestamps: string[] | undefined = undefined
  ) => {
    if (timestamps) {
      timestamps.forEach((timestamp) => {
        let numTimestamp = JSON.parse(timestamp) as number[];
        if (caller === Callers.suggested) {
          dispatch(
            removeSuggestedWords({
              currWord: word,
              removeTimestamp: numTimestamp,
              all: false,
            })
          );
        } else {
          dispatch(
            removeUnselectedWords({
              currWord: word,
              removeTimestamp: numTimestamp,
              all: false,
            })
          );
        }

        dispatch(
          updateTimestamp({
            word: word,
            caller: caller,
            timestamp: timestamp,
            remove: true,
          })
        );
      });
    } else {
      if (caller === Callers.suggested) {
        dispatch(
          removeSuggestedWords({
            currWord: word,
            removeTimestamp: [],
            all: true,
          })
        );
      } else {
        dispatch(
          removeUnselectedWords({
            currWord: word,
            removeTimestamp: [],
            all: true,
          })
        );
      }

      dispatch(
        updateWord({
          word: word,
          timestamps: [],
          caller: caller,
        })
      );
    }
  };

  const confirmSelection = () => {
    const selected: { [index: string]: number[][] } = {};

    Object.keys(checkList).forEach((word) => {
      let timestamps = checkList[word]["timestamps"];
      let caller = checkList[word]["caller"];
      let data = caller === Callers.suggested ? suggestions : entry;

      if (timestamps) {
        let removeAllTimes = removeAllTimesWord(caller, word, timestamps);

        if (removeAllTimes) {
          selected[word] = data[word];
          updateStore(caller, word);
        } else {
          let numTimestamps = timestamps.map((timestamp) => {
            return JSON.parse(timestamp) as number[];
          });
          selected[word] = numTimestamps;
          updateStore(caller, word, timestamps);
        }
      }
    });

    dispatch(addCensorWords({ entries: selected }));
  };

  const selectAll = (unselect: boolean, caller: string) => {
    let data = caller === Callers.suggested ? suggestions : entry;
    let visibleWords =
      caller === Callers.suggested ? visibleSuggestion : visibleEntry;

    if (unselect) {
      visibleWords.forEach((word) => {
        dispatch(
          updateWord({
            word: word,
            timestamps: [],
            caller: caller,
          })
        );
      });
    } else {
      if (data) {
        visibleWords.forEach((word) => {
          let timestamps = data[word].map((timestamp) => {
            return JSON.stringify(timestamp);
          });

          dispatch(
            updateWord({
              word: word,
              timestamps: timestamps,
              caller: caller,
            })
          );
        });
      }
    }
  };

  const reset = () => {
    dispatch(resetWordList());
    dispatch(resetCheckLists());
  };

  const hideSuggestions = () => {
    const suggestionsOuter = document.getElementById(
      "suggestions-outer"
    ) as HTMLDivElement;
    const suggestionsInput = document.getElementById(
      "suggestions-checkbox"
    ) as HTMLInputElement;
    const suggestionsExpanded = document.getElementById(
      "suggestions-expanded"
    ) as HTMLDivElement;
    const unselectedOuter = document.getElementById(
      "unselected-outer"
    ) as HTMLDivElement;
    const suggestionExpander = document.getElementById(
      "suggestions-show"
    ) as HTMLSpanElement;

    if (suggestionsInput.checked) {
      suggestionsExpanded.style.display = "none";
      setSuggestionsHidden(true);
      suggestionExpander.innerText = "[+]";
    } else {
      suggestionsExpanded.style.display = "block";
      setSuggestionsHidden(false);

      suggestionExpander.innerText = "[-]";
    }
  };

  //============================================================== FUNCTIONAL COMPONENTS ==============================================================

  const rows = ({
    data,
    index,
    style,
  }: {
    data: { list: string[]; caller: string };
    index: number;
    style: React.CSSProperties;
  }) => {
    return (
      <div style={style}>
        <WordsList data={data} index={index} displayWord={displayWord} />
      </div>
    );
  };

  //============================================================== MAIN COMPONENT ==============================================================

  return (
    <div id="word-selector" style={{ display: "block" }}>
      <div
        style={{
          display: "block",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", width: "100%" }}>
          <input
            id="search-bar"
            type="text"
            placeholder="Search Here"
            style={{
              paddingTop: "2%",
              paddingBottom: "2%",
              marginTop: "2%",
              marginBottom: "2%",
              borderRadius: "5px",
              maxWidth: "40%",
              marginRight: "5%",
            }}
            onChange={(e) => {
              let curr = e.target as HTMLInputElement;
              setSearchTerm(curr.value);
            }}
          />

          <div
            style={{
              display: "flex",
              // maxHeight: "100%",
              marginTop: "2%",
              marginBottom: "2%",
              // width: "50%",
              marginLeft: "auto",
            }}
          >
            <Tooltip
              title={"Reset 'Words' and 'To Censor' back to initial state"}
              enterNextDelay={1250}
              enterDelay={1250}
              enterTouchDelay={1250}
              TransitionComponent={Zoom}
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: "rgb(30,30,30)",
                  },
                },
              }}
            >
              <Button
                variant="contained"
                style={{
                  padding: "2%",
                  color: "lightgray",
                  marginRight: "4%",
                  backgroundColor: "rgb(80,80,80)",
                }}
                onClick={reset}
              >
                Reset
              </Button>
            </Tooltip>

            <Tooltip
              title={
                "Press here to add all your selected Words and Timestamps to 'To Censor'. This action will mark these timestamps for censorship when submitting"
              }
              enterNextDelay={1250}
              enterDelay={1250}
              enterTouchDelay={1250}
              TransitionComponent={Zoom}
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: "rgb(30,30,30)",
                  },
                },
              }}
            >
              <Button
                variant="contained"
                // disabled={Object.keys(checkList).length >= 1 ? false : true}
                style={{
                  margin: "0",
                  padding: "2%",
                  color: "lightgray",
                  backgroundColor: "rgb(80,80,80)",
                }}
                onClick={confirmSelection}
              >
                Censor
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>

      <Paper
        id="suggestions-outer"
        style={{
          height: suggestionsHidden ? "5%" : "auto",
          margin: "4% auto",
          overflow: "hidden",
          width: "95%",
          padding: "3%",
          backgroundColor: "rgb(80,80,80)",
          color: "lightgray",
        }}
      >
        <div style={{ display: "flex" }}>
          <Tooltip
            title={
              "Words that our Algorithms determined are likely to cause issues with your platforms content guidelines"
            }
            enterNextDelay={1250}
            enterDelay={1250}
            enterTouchDelay={1250}
            TransitionComponent={Zoom}
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: "rgb(30,30,30)",
                },
              },
            }}
          >
            <h4 style={{ margin: "0" }}>AI Suggestions</h4>
          </Tooltip>

          <Checkbox
            size="small"
            sx={{
              color: "rgb(200,200,200)",
              "&.Mui-checked": {
                color: "rgb(180,180,180)",
              },
            }}
            style={{ margin: "0", padding: "0" }}
            onClick={(e) => {
              let checked = (e.target as HTMLInputElement).checked;
              selectAll(!checked, Callers.suggested);
            }}
          />

          <label
            style={{
              display: "block",
              marginLeft: "auto",
              marginRight: "0%",
              fontSize: "100%",
              padding: "1px",
              width: "5%",
            }}
          >
            <input
              type="checkbox"
              onClick={() => {
                hideSuggestions();
              }}
              id={"suggestions-checkbox"}
              style={{ display: "none" }}
            />
            <span className="expander" id={"suggestions-show"}>
              [-]
            </span>
          </label>
        </div>

        <div
          id="suggestions-expanded"
          style={{
            display: "flex",
            padding: "0",
            margin: "0",
          }}
        >
          {Object.keys(suggestions).length > 0 ? (
            <List
              height={suggestionsHidden ? 0 : 90}
              width={"100%"}
              itemCount={visibleSuggestion.length}
              itemSize={25}
              itemData={{
                list: visibleSuggestion.sort(),
                caller: Callers.suggested,
              }}
            >
              {rows}
            </List>
          ) : (
            <div
              style={{
                height: 90,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
                justifyContent: "center",
                color: "rgb(110,110,110)",
              }}
            >
              {" "}
              None{" "}
            </div>
          )}
        </div>
      </Paper>

      {/* <Checkbox
        size="small"
        sx={{
          color: "rgb(200,200,200)",
          "&.Mui-checked": {
            color: "rgb(180,180,180)",
          },
        }}
        style={{ margin: "0", padding: "0" }}
        id="select-all"
        onClick={(e) => {
          let checked = (e.target as HTMLInputElement).checked;
          selectAll(!checked, Callers.unselected);
        }}
      /> */}

      <div id="unselected-outer" style={{}}>
        <List
          height={
            checkBrowser()
              ? suggestionsHidden
                ? 220
                : 120
              : suggestionsHidden
              ? 260
              : 170
          }
          width={"100%"}
          itemCount={visibleEntry.length}
          itemSize={25}
          itemData={{ list: visibleEntry.sort(), caller: Callers.unselected }}
        >
          {rows}
        </List>
      </div>
    </div>
  );
};

export default UncensoredSelector;
