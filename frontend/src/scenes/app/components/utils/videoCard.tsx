import React from "react";
import { FileUpload } from "../../../../store/features/fileSlice";

const VideoCard = ({ file }: { file: FileUpload | null }) => {
  return (
    <div id="uploaded-content" style={{ display: "flex", alignItems: "end" }}>
      {file && file.fileType.includes("audio") ? (
        <audio
          controls
          src={file.fileUrl}
          style={{
            width: "100%",
          }}
        />
      ) : (
        <video
          controls
          id="uploaded-video"
          autoPlay
          src={file?.fileUrl}
          style={{
            width: "100%",
            borderRadius: "5px",
            marginTop: "auto",
          }}
        />
      )}
    </div>
  );
};

export default VideoCard;
