import React from "react";

import { FileUpload } from "../../../../store/features/fileSlice";

const FileDetails = ({ file }: { file: FileUpload | null }) => {
  const mobile = () => {
    return window.innerWidth < 1200;
  };

  return (
    <div
      style={
        mobile()
          ? {
              height: "90%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              // alignItems: "center",
            }
          : { padding: "2%" }
      }
    >
      <h3 style={mobile() ? { margin: 0, padding: "1%" } : { marginTop: "0" }}>
        Submission Details
      </h3>

      <p style={mobile() ? { margin: 0, padding: "1%" } : {}}>
        <b>File Name:</b>{" "}
        {file?.fileName && file?.fileName.length > 30
          ? file?.fileName.slice(0, 14) + "..."
          : file?.fileName}
      </p>

      <p style={mobile() ? { margin: 0, padding: "1%" } : {}}>
        <b>File Type:</b> {file?.fileType}
      </p>

      <p style={mobile() ? { margin: 0, padding: "1%" } : {}}>
        <b>File Size:</b> {file?.fileSize}
      </p>
    </div>
  );
};

export default FileDetails;
