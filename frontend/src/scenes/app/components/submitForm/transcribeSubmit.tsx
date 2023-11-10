import React, { useState, useRef, SyntheticEvent, useEffect } from "react";
import { componentIDs } from "../../../../store/features/formSlice";
import "../../css/submitForm.css";
import Toggle from "../../../utils/components/toggle";
import {
  urlToFile,
  sendFile,
  RequestStates,
  fetchTranscription,
} from "../../../../store/features/dataSlice";
import { useAppSelector, useAppDispatch } from "../../../../store/store";
import { FileUpload } from "../../../../store/features/fileSlice";
import { Mode } from "../../../../store/features/dataSlice";
import ProgressBar from "../../../utils/components/progressBar";
// import { socket } from "../../../../socket";
import { Button } from "@mui/material";
import { UserDetails } from "../../../../store/features/userSlice";

const SubmitSettings = () => {
  //Constants
  const dispatch = useAppDispatch();

  //States
  const [mode, setMode] = useState<Mode>(Mode.auto);
  const [progress, setProgress] = useState<number>(0);

  const [currFile, setCurrFile] = useState<File | null>(null);
  const fetchData = useAppSelector((state) => state.data);
  const currFileUpload: FileUpload | null = useAppSelector(
    (state) => state.file.uploadedFile
  );
  const user = useAppSelector((state) => state.user.userDetails);
  const pending = useAppSelector((state) => state.data.transcription.status);

  //Refs
  const submitRef = useRef<HTMLButtonElement>(null);

  //Functions and Event Handlers
  const submitFunction = async () => {
    if (currFileUpload) {
      console.log("Submitting: ", currFileUpload);
      let currFile = await urlToFile(currFileUpload);
      if (currFile != null && !(currFile instanceof Error)) {
        setCurrFile(currFile);
        if (submitRef.current) submitRef.current.style.display = "none";
      } else console.log("file is either null or threw an error");
    }
  };

  //UseEffect to trigger sendFile thunk when currFile is transformed into a file successfully
  useEffect(() => {
    if (currFile !== null && fetchData.sendFile.status === RequestStates.idle) {
      dispatch(sendFile({ file: currFile, uuid: user ? user.uuid : "" }));
    }
  }, [currFile, fetchData.sendFile.status, dispatch, user]);

  //UseEffect to trigger fetchTranscription api call when sendFile has been executed successfully
  useEffect(() => {
    if (
      fetchData.sendFile.status === RequestStates.success &&
      fetchData.transcription.status === RequestStates.idle &&
      fetchData.sendFile.response !== undefined &&
      currFileUpload != null
    ) {
      console.log("Moving to transcription...");

      // socket.emit("uploadedFile", fetchData.sendFile.response.body.uuid);

      dispatch(
        fetchTranscription({
          mode: mode,
          uuid: fetchData.sendFile.response.body.uuid,
          contentType: currFileUpload.fileType,
        })
      );
      updateProgress();
    } else {
    }
  }, [
    fetchData.sendFile.status,
    fetchData.sendFile.response,
    fetchData.transcription.status,
    mode,
    currFileUpload,
    dispatch,
  ]);

  const updateProgress = async function () {
    var secondsRan = 0.0;
    var interval = setInterval(function () {
      secondsRan += 1.0;
      if (currFile && currFile !== undefined) {
        var percentage = ((secondsRan * 1.25 * 1000000) / currFile.size) * 100;

        if (percentage < 100) {
          setProgress(percentage);
        } else {
          clearInterval(interval);
        }
      } else {
        clearInterval(interval);
      }
    }, 1000);
  };

  return (
    <Toggle id={componentIDs.formSettings}>
      <div style={{ width: "100%", marginTop: "0%" }}>
        <Button
          variant="contained"
          style={{
            float: "right",
            fontWeight: "bold",
            width: "20%",
            color: "lightgray",
            backgroundColor: "rgb(120,120,120)",
          }}
          ref={submitRef}
          onClick={submitFunction}
          disabled={
            pending === RequestStates.pending ||
            pending === RequestStates.success
              ? true
              : false
          }
        >
          Submit
        </Button>
      </div>

      {fetchData.transcription.status === "pending" ? (
        <div style={{ width: "100%", marginTop: "2%" }}>
          <ProgressBar bgColor={"#ececec"} completed={progress} />
        </div>
      ) : (
        <></>
      )}
    </Toggle>
  );
};

export default SubmitSettings;
