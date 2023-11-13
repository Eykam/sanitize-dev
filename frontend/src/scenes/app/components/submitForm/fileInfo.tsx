import React, { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import Toggle from "../../../utils/components/toggle";
import { componentIDs } from "../../../../store/features/formSlice";
import { RequestStates } from "../../../../store/features/dataSlice";
import Loading from "../../../utils/components/loading";

const FileInfo = () => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const file = useAppSelector((state) => state.file.uploadedFile);
  const transcriptionStatus = useAppSelector(
    (state) => state.data.transcription.status
  );
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const checkBrowser = () => {
    return window.innerWidth < 1200;
  };

  const checkIfPending = () => {
    return transcriptionStatus === RequestStates.pending;
  };

  useEffect(() => {
    if (transcriptionStatus === RequestStates.pending) {
      setLoading(true);
      if (file?.fileType.includes("video") && videoRef.current)
        videoRef.current.pause();
      else if (audioRef.current) audioRef.current.pause();
    } else {
      setLoading(false);
    }
  }, [dispatch, transcriptionStatus]);

  return (
    <Toggle id={componentIDs.fileInfo}>
      <div
        id="file-info-div"
        style={
          checkBrowser()
            ? {
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                // alignItems: "center",
              }
            : {
                width: "100%",
                display: "block",
              }
        }
      >
        <div style={checkBrowser() ? {} : { width: "40vw" }}>
          <h3 style={{ marginTop: "0" }}>Submission Details:</h3>

          <span
            style={{
              display: "block",
              maxWidth: checkBrowser() ? "100%" : "50%",
              // textOverflow: "ellipsis",
              // overflow: "hidden",
            }}
          >
            <b>File Name:</b>{" "}
            {file?.fileName && file?.fileName.length > 30
              ? file?.fileName.slice(0, 14) + "..."
              : file?.fileName}
          </span>

          <p>
            <b>File Type:</b> {file?.fileType}
          </p>

          <p>
            <b>File Size:</b> {file?.fileSize}
          </p>

          {loading && (
            <div style={{ margin: "auto" }}>
              <Loading loaderId="transcribe" />
            </div>
          )}
        </div>

        <br />

        <div
          id="uploaded-content"
          style={checkIfPending() ? { display: "none" } : { display: "block" }}
        >
          {file && file.fileType.includes("audio") ? (
            <audio
              controls
              ref={audioRef}
              src={file.fileUrl}
              style={{
                width: "100%",
                borderRadius: checkBrowser() ? "15px" : "5px",
                marginTop: "auto",
              }}
            />
          ) : (
            <video
              controls
              id="uploaded-video"
              autoPlay
              ref={videoRef}
              src={file?.fileUrl}
              style={{
                width: "100%",
                borderRadius: checkBrowser() ? "15px" : "5px",
                marginTop: "auto",
              }}
            />
          )}
        </div>

        <br />
      </div>
    </Toggle>
  );
};

export default FileInfo;
