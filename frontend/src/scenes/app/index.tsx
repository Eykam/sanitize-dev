import React, { useEffect, useState } from "react";
import FileInputForm from "./components/inputForm/fileInputForm";
import SubmitForm from "./components/submitForm/submitForm";
import Dashboard from "./components/dashboard/dashboard";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { TranscriptionResponse } from "../../store/features/dataSlice";
import { hideSubmitForm, showDashboard } from "../../store/features/formSlice";

const AppEntry = () => {
  const dispatch = useAppDispatch();
  const transcriptionResponse: TranscriptionResponse | undefined =
    useAppSelector((state) => state.data.transcription.response);
  const [mobile, setMobile] = useState(false);
  const [transcriptionText, setTranscriptionText] = useState("");
  const [elapsedtimeText, setElapsedTime] = useState("");
  const [currWords, setWords] = useState<{
    [index: string]: number[][];
  } | null>(null);

  useEffect(() => {
    setMobile(window.innerWidth < 1200);
  }, []);

  useEffect(() => {
    let transcribed = "";
    let words: { [index: string]: number[][] } | null = null;

    const showTranscription = () => {
      if (transcriptionResponse?.data !== undefined) {
        if (!mobile && Notification.permission)
          new Notification("Transcription Complete!");

        for (let x in transcriptionResponse.data) {
          let currEntry = transcriptionResponse.data[x];
          transcribed += currEntry.text;

          let currWord = currEntry.text.replace(/[^\w*]/g, "").toLowerCase();

          let validWord = currWord !== "" && /[aeiouy\d\*]/.test(currWord);
          if (!validWord) console.log("Word: ", currWord, " hasVowel: false");

          if (words != null && validWord) {
            if (words[currWord] !== undefined) {
              words[currWord].push([currEntry.start, currEntry.end]);
            } else {
              words[currWord] = [[currEntry.start, currEntry.end]];
            }
          } else if (validWord) {
            words = { [currWord]: [[currEntry.start, currEntry.end]] };
          }
        }

        setWords(words);
        setTranscriptionText(transcribed);
        setElapsedTime(transcriptionResponse.requestTime);
        dispatch(showDashboard());
        dispatch(hideSubmitForm());
      }
    };

    showTranscription();
  }, [dispatch, transcriptionResponse, mobile]);

  return (
    <div
      id="app-entry"
      style={{
        margin: "auto",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <FileInputForm />
      <SubmitForm />
      <Dashboard currWords={currWords} />
    </div>
  );
};

export default AppEntry;
