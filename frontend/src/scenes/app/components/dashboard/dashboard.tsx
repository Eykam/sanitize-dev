import React, { useState, useRef } from "react";
import Toggle from "../../../utils/components/toggle";
import { componentIDs } from "../../../../store/features/formSlice";
import AudioWave from "../../../utils/components/audioWave";
import FileDetails from "../utils/fileDetails";
import { useAppSelector } from "../../../../store/store";
import VideoCard from "../utils/videoCard";
import { Callers } from "./components/wordCard";
import WordCard from "./components/wordCard";
import CensorSubmit from "./components/censorSubmit";
import SelectorContainer from "./components/selectorContainer";
import { RequestStates } from "../../../../store/features/dataSlice";
import Loading from "../../../utils/components/loading";
import CensoredVideo from "../utils/censoredVideo";
import CensoredResults from "./components/censoredResults";
import Redirect from "../../../utils/components/redirect";
import { Box, IconButton, Paper, Typography, Tooltip } from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import Zoom from "@mui/material/Zoom";

const Dashboard = ({
  currWords,
}: {
  currWords: {
    [index: string]: number[][];
  } | null;
}) => {
  const file = useAppSelector((state) => state.file.uploadedFile);
  const submittingStatus = useAppSelector(
    (state) => state.data.censorship.status
  );

  const [downloaded, setDownloaded] = useState(false);
  const [currWordInfo, setCurrWordInfo] = useState<{
    word: string;
    caller: string;
  }>({ word: "", caller: Callers.unselected });

  const checkBrowser = () => {
    return window.innerWidth <= 1500;
  };

  const checkMobile = () => {
    return window.innerWidth <= 1200;
  };

  const changeWord = (word: string, caller: string) => {
    setCurrWordInfo({ word: word, caller: caller });
  };

  const userDownloaded = () => {
    setDownloaded(true);
  };

  const desktopDashboard = () => {
    return (
      <Paper
        style={{
          width: "fit-content",
          height: "fit-content",
          margin: checkBrowser() ? "2% 6%" : "2% 12%",
          color: "rgb(226, 226, 226)",
          padding: "1%",
          background: "rgb(65, 65, 65)",
          boxShadow: "rgba(0, 0, 0, 0.5) 0px 5px 10px",
        }}
      >
        {/* Word Selection */}
        {submittingStatus === RequestStates.idle && (
          <Box display="grid" gridTemplateColumns="repeat(32,1fr)" gap="20px">
            {/* Container for header*/}
            <Box gridColumn="span 32">
              <Paper
                style={{
                  height: "100%",
                  color: "lightgray",
                  background: "rgb(70, 70, 70)",
                }}
              >
                <div style={{ display: "flex", margin: "auto" }}>
                  <h1 style={{ margin: ".2%", padding: "0", marginRight: "0" }}>
                    Analyzing Audio
                  </h1>
                  <AudioWave />
                </div>
              </Paper>
            </Box>

            <Box gridColumn="span 16">
              <Paper
                style={{
                  background: "rgb(70, 70, 70)",
                  color: "lightgray",
                  maxHeight: checkBrowser() ? "22vh" : "20vh",
                  height: checkBrowser() ? "22vh" : "20vh",
                }}
              >
                <FileDetails file={file} />
              </Paper>
            </Box>

            <Box gridColumn="span 16">
              <Paper
                style={{
                  background: "rgb(70, 70, 70)",
                  color: "lightgray",
                  maxHeight: checkBrowser() ? "22vh" : "20vh",
                  height: checkBrowser() ? "22vh" : "20vh",
                }}
              >
                <WordCard
                  word={currWordInfo["word"]}
                  caller={currWordInfo["caller"]}
                />
              </Paper>
            </Box>

            <Box
              gridColumn="span 32"
              display="grid"
              gridTemplateColumns="repeat(4,1fr)"
              gap="20px"
              style={{ height: "fit-content" }}
            >
              <Box gridColumn="span 2">
                <VideoCard file={file} />
              </Box>

              <SelectorContainer
                mobile={false}
                currWords={currWords}
                displayWord={changeWord}
              />
            </Box>

            {/* Container for Submit buttons and options*/}
            <Box gridColumn="span 32">
              <Paper
                style={{
                  height: "fit-content",
                  background: "none",
                  boxShadow: "none",
                  border: "none",
                }}
              >
                <div style={{ width: "10%", float: "right" }}>
                  <CensorSubmit downloaded={undefined} />
                </div>
              </Paper>
            </Box>
          </Box>
        )}

        {submittingStatus === RequestStates.pending && (
          <Box
            display="grid"
            gridTemplateColumns="repeat(32,1fr)"
            gap="20px"
            style={{ padding: "2%" }}
          >
            {/* Container for header*/}
            <Box gridColumn="span 32">
              <Paper
                style={{
                  height: "100%",
                  color: "lightgray",
                  background: "none",
                  boxShadow: "none",
                }}
              >
                <div style={{ display: "flex", margin: "auto" }}>
                  <h1 style={{ margin: ".2%", padding: "0", marginRight: "0" }}>
                    Censoring Audio
                  </h1>
                  <AudioWave />
                </div>
              </Paper>
            </Box>

            <Box gridColumn="span 32">
              <div
                style={{
                  color: "lightgray",
                  height: "auto",
                }}
              >
                <FileDetails file={file} />
                <Loading loaderId="censored-loader" />
              </div>
            </Box>
          </Box>
        )}

        {submittingStatus === RequestStates.success && (
          <Box display="grid" gridTemplateColumns="repeat(32,1fr)" gap="20px">
            {/* Container for header*/}
            <Box gridColumn="span 32">
              <Paper
                style={{
                  height: "100%",
                  color: "lightgray",
                  background: "rgb(70, 70, 70)",
                }}
              >
                <div style={{ display: "flex", margin: "auto" }}>
                  <h1 style={{ margin: ".2%", padding: "0", marginRight: "0" }}>
                    Results
                  </h1>
                  <AudioWave />
                </div>
              </Paper>
            </Box>

            <Box gridRow="span 1" gridColumn="span 16">
              <Paper
                style={{
                  color: "lightgray",
                  background: "rgb(70, 70, 70)",
                  padding: "2%",
                }}
              >
                <CensoredVideo />
              </Paper>
            </Box>

            <Box gridRow="span 1" gridColumn="span 16">
              <CensoredResults />
            </Box>

            <Box gridColumn="span 32">
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "end",
                }}
              >
                <CensorSubmit downloaded={userDownloaded} />
              </div>
            </Box>
          </Box>
        )}

        {submittingStatus === RequestStates.error && <div>Error</div>}
      </Paper>
    );
  };

  const mobileDashboard = () => {
    return (
      <Paper
        style={{
          width: "98vw",
          height: "fit-content",
          margin: "1%",
          color: "rgb(226, 226, 226)",
          padding: "1%",
          background: "none",
          // boxShadow: "6px 5px 5px rgb(35,35,35)",
        }}
      >
        {/* Word Selection */}
        {submittingStatus === RequestStates.idle && (
          <Box
            display="block"
            gap="20px"
            style={{ width: "95%", margin: "auto" }}
          >
            {/* Container for header*/}
            <Box>
              <Paper
                style={{
                  height: "100%",
                  color: "lightgray",
                  background: "none",
                }}
              >
                <div style={{ display: "flex", margin: "auto" }}>
                  <h1 style={{ margin: ".2%", padding: "0", marginRight: "0" }}>
                    Analyzing Audio
                  </h1>
                  <AudioWave />
                </div>
              </Paper>
            </Box>

            <Box style={{ width: "100%" }}>
              <Paper
                style={{
                  background: "none",
                  color: "lightgray",
                  maxHeight: checkBrowser() ? "22vh" : "20vh",
                  height: checkBrowser() ? "22vh" : "20vh",
                }}
              >
                <FileDetails file={file} />
              </Paper>
            </Box>

            <Box
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                borderRadius: "15px",
                boxShadow: "rgba(0, 0, 0, 0.5) 0px 5px 10px",
              }}
            >
              <VideoCard file={file} />
            </Box>

            <Box>
              <Paper
                style={{
                  background: "rgb(70,70,70)",
                  margin: "2% 0",
                  color: "lightgray",
                  height: "22vh",
                  boxShadow: "rgba(0, 0, 0, 0.5) 0px 5px 10px",
                  borderRadius: "15px",
                }}
              >
                <WordCard
                  word={currWordInfo["word"]}
                  caller={currWordInfo["caller"]}
                />
              </Paper>
            </Box>

            <Paper
              style={{
                background: "rgb(70,70,70)",
                margin: "2% 0",
                color: "lightgray",
                boxShadow: "rgba(0, 0, 0, 0.5) 0px 5px 10px",
                borderRadius: "15px",
              }}
            >
              <SelectorContainer
                mobile={checkBrowser()}
                currWords={currWords}
                displayWord={changeWord}
              />
            </Paper>

            {/* Container for Submit buttons and options*/}
            <Box style={{ margin: "2% 0", marginBottom: "" }}>
              <Paper
                style={{
                  height: "fit-content",
                  background: "none",
                  boxShadow: "rgba(0, 0, 0, 0.5) 0px 5px 10px",
                  border: "none",
                }}
              >
                <div
                  style={{ width: "10%", float: "right", borderRadius: "15px" }}
                >
                  <CensorSubmit downloaded={undefined} />
                </div>
              </Paper>
            </Box>
          </Box>
        )}

        {submittingStatus === RequestStates.pending && (
          <Box
            display="block"
            gap="20px"
            style={{ width: "95%", margin: "auto" }}
          >
            {/* Container for header*/}
            <Box>
              <Paper
                style={{
                  height: "100%",
                  color: "lightgray",
                  background: "none",
                  boxShadow: "none",
                }}
              >
                <div style={{ display: "flex", margin: "auto" }}>
                  <h1 style={{ margin: ".2%", padding: "0", marginRight: "0" }}>
                    Censoring Audio
                  </h1>
                  <AudioWave />
                </div>
              </Paper>
            </Box>

            <Box>
              <div
                style={{
                  color: "lightgray",
                  height: "auto",
                }}
              >
                <FileDetails file={file} />
                <Loading loaderId="censored-loader" />
              </div>
            </Box>
          </Box>
        )}

        {submittingStatus === RequestStates.success && (
          <Box display="block" gap="20px">
            {/* Container for header*/}
            <Box gridColumn="span 32">
              <Paper
                style={{
                  height: "100%",
                  color: "lightgray",
                  background: "none",
                }}
              >
                <div style={{ display: "flex", margin: "auto" }}>
                  <h1 style={{ margin: ".2%", padding: "0", marginRight: "0" }}>
                    Results
                  </h1>
                  <AudioWave />
                </div>
              </Paper>
            </Box>

            <Box
              gridRow="span 1"
              gridColumn="span 16"
              style={{ borderRadius: "15px" }}
            >
              <Paper
                style={{
                  color: "lightgray",
                  background: "none",
                  padding: "2%",
                  borderRadius: "15px",
                }}
              >
                <CensoredVideo />
              </Paper>
            </Box>

            <Box
              gridRow="span 1"
              gridColumn="span 16"
              style={{
                boxShadow: "rgba(0, 0, 0, 0.5) 0px 5px 10px",
                borderRadius: "15px",
              }}
            >
              <CensoredResults />
            </Box>

            <Box gridColumn="span 32">
              <div
                style={{
                  display: "flex",
                  padding: "1%",
                  width: "30%",
                  marginLeft: "auto",
                  boxShadow: "rgba(0, 0, 0, 0.5) 0px 5px 10px",
                  borderRadius: "15px",
                }}
              >
                <CensorSubmit downloaded={userDownloaded} />
              </div>
            </Box>
          </Box>
        )}

        {submittingStatus === RequestStates.error && <div>Error</div>}
      </Paper>
    );
  };

  return (
    <Toggle id={componentIDs.dashboard}>
      {downloaded ? (
        <Redirect message="Successfully Downloaded!" timeout={5} />
      ) : checkMobile() ? (
        mobileDashboard()
      ) : (
        desktopDashboard()
      )}
    </Toggle>
  );
};

export default Dashboard;
