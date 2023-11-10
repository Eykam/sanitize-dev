import React, { useEffect } from "react";

import "../../../css/submitForm.css";
import {
  RequestStates,
  fetchCensorship,
} from "../../../../../store/features/dataSlice";
import { useAppSelector, useAppDispatch } from "../../../../../store/store";
import { Button } from "@mui/material";

const CensorSubmit = ({
  downloaded = undefined,
}: {
  downloaded: undefined | (() => void);
}) => {
  const dispatch = useAppDispatch();

  const badWords = useAppSelector((state) => state.data.censorship.censorList);
  const originalFilename = useAppSelector(
    (state) => state.file.uploadedFile?.fileName
  );
  const filename = useAppSelector(
    (state) => state.data.sendFile.response?.body.uuid
  );
  const censoredStatus = useAppSelector(
    (state) => state.data.censorship.status
  );
  const censoredURLObject = useAppSelector(
    (state) => state.data.censorship.censorURL
  );

  const submit = () => {
    console.log("Clicked Submit");
    if (
      badWords != null &&
      badWords !== undefined &&
      Object.keys(badWords).length > 0
    ) {
      if (filename !== undefined) {
        dispatch(
          fetchCensorship({
            filename: filename,
            badWords: badWords,
          })
        );
      }
    }
  };

  const download = () => {
    let link = document.createElement("a");
    link.download =
      originalFilename !== undefined
        ? "censored-" + originalFilename
        : "censored-video";
    link.href = censoredURLObject;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => {
      if (downloaded) downloaded();
    }, 2000);
  };

  const checkBrowser = () => {
    return window.matchMedia("(max-width: 767px)").matches;
  };

  useEffect(() => {
    if (censoredStatus === RequestStates.success) {
      if (!checkBrowser() && Notification.permission)
        new Notification("Censoring Complete!\nFile is Ready for Download");

      const submitButton = document.getElementById(
        "submit-button-censor"
      ) as HTMLButtonElement;
      const downloadButton = document.getElementById(
        "download-button-censor"
      ) as HTMLAnchorElement;

      submitButton.style.display = "none";
      // submitButton.style.marginLeft = "0%";

      downloadButton.style.display = "flex";
      downloadButton.href = censoredURLObject;
    }
  }, [dispatch, censoredStatus, censoredURLObject]);

  return (
    <div
      style={
        checkBrowser()
          ? {
              marginTop: ".5%",
              width: "100%",
              display: "flex",
              justifyContent: "right",
            }
          : {
              marginLeft: "auto",
              marginTop: "0%",
              // width: "50%",
              // minWidth: "40vw",
              display: "flex",
              justifyContent: "right",
            }
      }
    >
      <Button
        id="submit-button-censor"
        variant="contained"
        style={{
          marginLeft: "auto",
          fontWeight: "bold",
          width: "100%",
          color: "lightgray",
          backgroundColor: "rgb(80,80,80)",
        }}
        onClick={submit}
      >
        Submit
      </Button>

      <Button
        id="download-button-censor"
        variant="contained"
        style={{
          fontWeight: "bold",
          width: "100%",
          display: "none",
          justifyContent: "center",
          alignItems: "center",
          marginLeft: "2.5%",
          color: "lightgray",
          backgroundColor: "rgb(80,80,80)",
        }}
        onClick={download}
      >
        Download
      </Button>
    </div>
  );
};

export default CensorSubmit;
