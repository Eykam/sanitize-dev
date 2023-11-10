import React from "react";
import { useAppSelector } from "../../../../store/store";
import { RequestStates } from "../../../../store/features/dataSlice";

const CensoredVideo = () => {
  const censorStatus = useAppSelector((state) => state.data.censorship.status);

  const censorURLObject = useAppSelector(
    (state) => state.data.censorship.censorURL
  );

  const fileInfo = useAppSelector((state) => state.file.uploadedFile);
  const requestTime = useAppSelector(
    (state) => state.data.transcription.response?.requestTime
  );
  const totalWordsCensored = useAppSelector(
    (state) => state.data.censorship.censorList
  );

  const checkBrowser = () => {
    return window.innerWidth < 1200;
  };

  // const checkIFSmallLaptop = () => {
  //   return window.innerWidth <= 1500;
  // };

  const getTotalWords = () => {
    let total = 0;
    if (totalWordsCensored !== undefined) {
      Object.keys(totalWordsCensored).forEach((currWord) => {
        total += totalWordsCensored[currWord].length;
      });
    }

    return total;
  };

  const getSpeedUp = () => {
    const video = document.getElementsByTagName("video")[0] as HTMLVideoElement;

    return video
      ? video.duration / Number(requestTime)
      : 0 / Number(requestTime);
  };

  return (
    <div>
      {/* <h2 style={{ padding: "0", marginTop: "0" }}> Censored Video</h2> */}

      <div style={{ marginTop: "auto" }}>
        <div>
          <span
            style={{
              marginRight: "5%",
              maxWidth: "100%",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            <b>File Name: </b>
            <span style={{ color: "rgb(150,150,150)", fontWeight: "bold" }}>
              {" "}
              {fileInfo?.fileName && fileInfo?.fileName.length > 30
                ? "censored-" + fileInfo?.fileName.slice(0, 14) + "..."
                : "censored-" + fileInfo?.fileName}
            </span>
          </span>
        </div>

        {checkBrowser() ? <></> : <br />}

        <div>
          <b> Size: </b>
          <span style={{ color: "rgb(150,150,150)", fontWeight: "bold" }}>
            {" "}
            {fileInfo?.fileSize}
          </span>
        </div>

        {checkBrowser() ? <></> : <br />}

        <div>
          <b>Total Words Censored: </b>
          <span style={{ color: "rgb(150,150,150)", fontWeight: "bold" }}>
            {" "}
            {getTotalWords()}
          </span>
        </div>

        {checkBrowser() ? <></> : <br />}

        <div>
          <b>Total Editing Time: </b>
          <span style={{ color: "rgb(150,150,150)", fontWeight: "bold" }}>
            {" "}
            {requestTime} secs
          </span>
        </div>

        {checkBrowser() ? <></> : <br />}

        <div>
          <b>Speedup (compared to video length): </b>
          <span style={{ color: "rgb(150,150,150)", fontWeight: "bold" }}>
            {" "}
            {getSpeedUp().toFixed(2)}x
          </span>
        </div>

        <br />

        <video
          controls
          id="censored-video"
          style={{
            borderRadius: checkBrowser() ? "15px" : "5px",
            display: censorStatus === RequestStates.pending ? "none" : "block",
            width: "100%",
          }}
          autoPlay
          src={censorURLObject}
        />
      </div>
    </div>
  );
};

export default CensoredVideo;
