import React from "react";
import { Callers } from "./wordCard";
import { Checkbox } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../../store/store";
import {
  WordList as WL,
  WordDetails,
} from "../../../../../store/features/formSlice";
import { updateWord } from "../../../../../store/features/formSlice";

const WordsList = ({
  data,
  index,
  displayWord,
}: {
  data: { list: string[]; caller: string };
  index: number;
  displayWord: (word: string, caller: string) => void;
}) => {
  const dispatch = useAppDispatch();
  const curr = data.list[index];

  const unselected = useAppSelector((state) => state.data.unselectedWords);
  const selected = useAppSelector((state) => state.data.censorship.censorList);
  const suggested = useAppSelector((state) => state.data.suggestedWords);

  const focusedWord = useAppSelector((state) => {
    let wordDetails = state.form.focusedWord as WordDetails;
    return wordDetails;
  });

  const checkList = useAppSelector((state) => {
    if (data.caller === Callers.selected) return state.form.selectedList as WL;
    else return state.form.unselectedList as WL;
  });

  const censorReasons = useAppSelector((state) => {
    if (
      state.data.transcription.response != null &&
      state.data.transcription.response !== undefined
    ) {
      return state.data.transcription.response.badWords;
    }
  });

  const checked = (word: string): boolean => {
    if (checkList[word]) return true;
    else return false;
  };

  const getDataSource = () => {
    let caller = data.caller;
    let entry =
      caller === Callers.suggested
        ? suggested
        : caller === Callers.unselected
        ? unselected
        : selected;

    return entry;
  };

  const updateCheckbox = (word: string, caller: string, checked: boolean) => {
    let wordInfo = getDataSource();

    if (wordInfo) {
      let timestamps = wordInfo[word].map((timestamp) => {
        return JSON.stringify(timestamp);
      });

      if (!checked) {
        dispatch(
          updateWord({
            word: word,
            timestamps: [],
            caller: caller,
          })
        );
      } else {
        dispatch(
          updateWord({
            word: word,
            timestamps: timestamps,
            caller: caller,
          })
        );
      }
    }
  };

  return (
    <div
      className="word-shell"
      style={{
        display: "flex",
        padding: "0.5%",
        background:
          curr === focusedWord.word && data.caller === focusedWord.caller
            ? "rgb(100,100,100)"
            : "",
        borderRadius: "5px",
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

          if (displayWord) displayWord(curr, data.caller);
        }}
      >
        <div
          style={{
            display: "flex",
            maxWidth: "100%",
          }}
        >
          <Checkbox
            size="small"
            sx={{
              color: "rgb(200,200,200)",
              "&.Mui-checked": {
                color: "rgb(180,180,180)",
              },
            }}
            style={{ margin: "0", padding: "0" }}
            id={curr}
            name={curr}
            defaultChecked={false}
            checked={checked(curr)}
            onClick={(e) => {
              updateCheckbox(
                curr,
                data.caller,
                (e.target as HTMLInputElement).checked
              );
            }}
          />
          {curr}

          {data.caller === Callers.suggested && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default WordsList;
