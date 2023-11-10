import React, { useEffect, useState } from "react";
import {
  IconButton,
  Box,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";
import { useAppSelector } from "../../../../../store/store";
import SmartDisplayIcon from "@mui/icons-material/SmartDisplay";
import { FileUpload } from "../../../../../store/features/fileSlice";
import "../../../css/wordSelector.css";

const ResultTimestamps = ({ word }: { word: string }) => {
  const removed = useAppSelector((state) => {
    let data = state.data.censorship.censorList;
    if (data) return data;
    else return {};
  });
  const badWords = useAppSelector((state) => {
    let data = state.data.transcription.response;
    if (data) return data.badWords;
    else return {};
  });
  const prevVideoUrl = useAppSelector(
    (state) => state.file.uploadedFile as FileUpload
  );
  const [prevVideo, setPrevVideo] = useState<HTMLVideoElement | null>(null);

  const printTimeStamp = (seconds: number[]): string => {
    let updatedTimestamps: string[] | null = null;

    seconds.forEach((currSeconds) => {
      const minutes = Math.floor(currSeconds / 60);
      const remainingSeconds = Math.floor(currSeconds - minutes * 60);

      if (updatedTimestamps == null) {
        updatedTimestamps = [
          String(minutes).padStart(2, "0") +
            ":" +
            String(remainingSeconds).padStart(2, "0"),
        ];
      } else {
        updatedTimestamps.push(
          String(minutes).padStart(2, "0") +
            ":" +
            String(remainingSeconds).padStart(2, "0")
        );
      }
    });

    if (updatedTimestamps)
      return updatedTimestamps[0] + " - " + updatedTimestamps[1];

    return "";
  };

  useEffect(() => {
    if (prevVideoUrl.fileUrl) {
      let prev = document.createElement("video");
      prev.src = prevVideoUrl.fileUrl;
      setPrevVideo(prev);
    }
  }, [prevVideoUrl]);

  const checkMobile = () => {
    return window.innerWidth <= 1200;
  };

  const playClip = (start: number, end: number, prev: boolean = false) => {
    try {
      const videoPlayer = document.getElementsByTagName(
        "video"
      )[0] as HTMLVideoElement;

      console.log("Videoplayer: ", videoPlayer);

      //   const audioPlayer = document.getElementsByTagName(
      //     "audio"
      //   )[0] as HTMLAudioElement;

      const player = prev && prevVideo ? prevVideo : videoPlayer;

      function checkTime() {
        if (player.currentTime >= end + 0.25) {
          player.pause();
        } else {
          /* call checkTime every 1/10th
                second until endTime */
          setTimeout(checkTime, 100);
        }
      }

      /* stop if playing (otherwise ignored) */
      player.pause();
      /* set video start time */
      player.currentTime = start - 0.25;
      /* play video */
      player.play();
      /* check the current time and
         pause IF/WHEN endTime is reached */
      checkTime();
    } catch (e) {
      console.log("Error playing clip: ", (e as Error).message);
    }
  };

  const getCount = (curr: string) => {
    let entry = removed;
    if (entry == null || entry === undefined || entry[curr] === undefined) {
      return [];
    } else {
      return entry[curr].length;
    }
  };

  const timestampComponent = () => {
    let entry = removed;
    let curr = word;
    console.log("removed wordslist: ", entry);
    console.log("currword:", entry[curr]);

    if (entry != null && entry !== undefined && entry[curr] !== undefined) {
      console.log("Timestamps test:", entry[curr]);
      return (
        <Paper
          className="expanded"
          // id={curr + "-expand"}
          style={{
            display: "block",
            width: "96%",
            height: "8vh",
            margin: "2%",
            color: "lightgray",
            background: "rgb(125,125,125)",
            justifyContent: "space-between",
            overflowY: "scroll",
          }}
        >
          {entry[curr].map((time, index) => {
            return (
              <div
                // className="timestamp-shell"
                className="timestamp-div"
                // id={curr + "-" + time + "-outer"}
                key={curr + "-" + time + "-" + index + "-outer"}
              >
                <b>{printTimeStamp(time)}</b>

                {checkMobile() ? (
                  <></>
                ) : (
                  <>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <b>Before: </b>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          playClip(time[0], time[1], true);
                        }}
                        aria-label={"play-clip-button-for" + word + "-" + time}
                        style={{
                          float: "right",
                          margin: "0",
                          padding: "0",
                          color: "lightgray",
                        }}
                      >
                        <SmartDisplayIcon />
                      </IconButton>
                    </div>

                    <div style={{ display: "flex", alignItems: "center" }}>
                      <b>After: </b>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          playClip(time[0], time[1]);
                        }}
                        aria-label={"play-clip-button-for" + word + "-" + time}
                        style={{
                          float: "right",
                          margin: "0",
                          padding: "0",
                          color: "lightgray",
                        }}
                      >
                        <SmartDisplayIcon />
                      </IconButton>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </Paper>
      );
    }
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      {word === undefined || word === "" ? (
        <div
          style={{
            display: "flex",
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            color: "gray",
          }}
        >
          SELECT A WORD{" "}
        </div>
      ) : (
        <div style={{ height: "100%" }}>
          {" "}
          <div style={{ padding: "1%" }}>
            <div>
              <span style={{ fontSize: "200%" }}>
                <b>{word}</b>
              </span>
              <span style={{ color: "gray" }}> count=[{getCount(word)}]</span>
            </div>
          </div>
          <div
            style={{
              display: "block",
              width: "100%",
              height: "70%",
              justifyContent: "center",
              margin: "auto",
              marginBottom: "2%",
            }}
          >
            <div
              style={{
                display: "inline-block",
                height: "100%",
                width: "50%",
                verticalAlign: "top",
              }}
            >
              <h4 style={{ padding: "0 2%", margin: "0" }}>Timestamps</h4>
              {timestampComponent()}
            </div>

            <div
              style={{
                display: "inline-flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "100%",
                width: "50%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  height: "fit-content",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "2%",
                }}
              >
                <Box sx={{ position: "relative", display: "inline-flex" }}>
                  <CircularProgress
                    variant="determinate"
                    size="5rem"
                    thickness={8}
                    color={
                      badWords[word]["percentage"] <= 0.5 ? "success" : "error"
                    }
                    value={
                      badWords[word]["percentage"] <= 0.5
                        ? (1 - badWords[word]["percentage"]) * 100
                        : badWords[word]["percentage"] * 100
                    }
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: "absolute",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      variant="caption"
                      fontSize="1.5rem"
                      fontWeight="bold"
                    >
                      {badWords[word]["percentage"] <= 0.5
                        ? (1 - badWords[word]["percentage"]) * 100
                        : badWords[word]["percentage"] * 100}
                    </Typography>
                  </Box>
                </Box>
              </div>

              <div
                style={{
                  display: "flex",
                  height: "fit-content",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <h3 style={{ margin: "0", padding: "0" }}>
                  Reason:
                  <span style={{ fontSize: "90%", color: "gray" }}>
                    {" "}
                    {badWords[word]["reason"] === "N/A"
                      ? "No Violation"
                      : badWords[word]["reason"]}
                  </span>
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultTimestamps;
