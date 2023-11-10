import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../../../../store/store";
import "../../../css/wordSelector.css";
import {
  removeSelectedWords,
  addUnselectedWords,
  addSuggestedWords,
} from "../../../../../store/features/dataSlice";
import { Checkbox, Button } from "@mui/material";
import { FixedSizeList as List } from "react-window";
import { Callers } from "./wordCard";
import WordsList from "./wordsList";
import {
  WordList,
  updateWord,
  updateTimestamp,
} from "../../../../../store/features/formSlice";

const CensoredSelector = ({
  displayWord,
}: {
  displayWord: (word: string, caller: string) => void;
}) => {
  const dispatch = useAppDispatch();

  const entry = useAppSelector((state) => {
    return state.data.censorship.censorList;
  });

  const originalSuggestedWords = useAppSelector(
    (state) => state.data.originalSuggestedWords
  );

  const checkList = useAppSelector(
    (state) => state.form.selectedList as WordList
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleEntry, setVisibility] = useState(
    entry ? Object.keys(entry) : []
  );

  useEffect(() => {
    const search = async (term: string) => {
      let data = entry ? Object.keys(entry) : [];
      if (term !== "") {
        setVisibility(data.filter((word) => word.includes(term)));
      } else {
        setVisibility(data);
      }
    };

    search(searchTerm);
  }, [entry, searchTerm]);

  const checkInSuggestedWords = (word: string): boolean => {
    if (originalSuggestedWords[word] === undefined) return false;
    else return true;
  };

  const removeAllTimesWord = (word: string, timestamps: string[]): boolean => {
    let data = entry || {};

    return timestamps.length === data[word].length;
  };

  const updateStore = (
    caller: string,
    word: string,
    timestamps: string[] | undefined = undefined
  ) => {
    if (timestamps) {
      timestamps.forEach((timestamp) => {
        let numTimestamp = JSON.parse(timestamp) as number[];

        dispatch(
          removeSelectedWords({
            currWord: word,
            removeTimestamp: numTimestamp,
            all: false,
          })
        );

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
      dispatch(
        removeSelectedWords({
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
  };

  const confirmSelection = () => {
    const sendToSuggested: { [index: string]: number[][] } = {};
    const sendToUnselected: { [index: string]: number[][] } = {};

    Object.keys(checkList).forEach((word) => {
      let timestamps = checkList[word]["timestamps"];
      let caller = Callers.selected;
      let data = entry || {};

      if (timestamps) {
        let removeAllTimes = removeAllTimesWord(word, timestamps);

        if (removeAllTimes) {
          if (checkInSuggestedWords(word)) sendToSuggested[word] = data[word];
          else sendToUnselected[word] = data[word];

          updateStore(caller, word);
        } else {
          let numTimestamps = timestamps.map((timestamp) => {
            return JSON.parse(timestamp) as number[];
          });

          if (checkInSuggestedWords(word))
            sendToSuggested[word] = numTimestamps;
          else sendToUnselected[word] = numTimestamps;

          updateStore(caller, word, timestamps);
        }
      }
    });

    dispatch(addUnselectedWords({ entries: sendToUnselected }));
    dispatch(addSuggestedWords({ entries: sendToSuggested }));
  };

  const selectAll = (unselect: boolean) => {
    let data = entry ? entry : {};

    if (unselect) {
      visibleEntry.forEach((word) => {
        dispatch(
          updateWord({
            word: word,
            timestamps: [],
            caller: Callers.selected,
          })
        );
      });
    } else {
      if (data) {
        visibleEntry.forEach((word) => {
          let timestamps = data[word].map((timestamp) => {
            return JSON.stringify(timestamp);
          });

          dispatch(
            updateWord({
              word: word,
              timestamps: timestamps,
              caller: Callers.selected,
            })
          );
        });
      }
    }
  };

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

  return (
    <div id="selected-words" style={{ display: "block" }}>
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        {/* <div style={{ display: "block" }}> */}
        <input
          id="search-bar-selected"
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
            display: "inline-block",
            maxHeight: "100%",
            marginTop: "2%",
            marginBottom: "2%",
          }}
        >
          <Button
            variant="contained"
            disabled={Object.keys(checkList).length >= 1 ? false : true}
            style={{
              margin: "0",
              marginLeft: "auto",
              padding: "2%",
              color: "lightgray",
              backgroundColor: "rgb(80,80,80)",
            }}
            onClick={confirmSelection}
          >
            KEEP
          </Button>
        </div>
        {/* </div> */}
      </div>

      <Checkbox
        size="small"
        sx={{
          color: "rgb(200,200,200)",
          "&.Mui-checked": {
            color: "rgb(180,180,180)",
          },
        }}
        style={{ margin: "0", marginTop: "4%", padding: "0" }}
        id="select-all-selected"
        onClick={(e) => {
          let checked = (e.target as HTMLInputElement).checked;
          selectAll(!checked);
        }}
      />

      <div id="selected-outer" style={{}}>
        {visibleEntry.length > 0 ? (
          <List
            height={290}
            width={"100%"}
            itemCount={visibleEntry.length}
            itemSize={25}
            itemData={{ list: visibleEntry.sort(), caller: Callers.selected }}
          >
            {rows}
          </List>
        ) : (
          <div
            style={{
              height: 290,
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
    </div>
  );
};

export default CensoredSelector;
