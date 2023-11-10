import React, { useState, useEffect } from "react";
import { Paper, Box, IconButton } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const Error = () => {
  const timeout = 5;
  const [time, setTime] = useState(0);

  useEffect(() => {
    setTimeout(function () {
      if (time < timeout) setTime((prev) => prev + 1);
      else window.location.href = "/";
    }, 1000);
  }, [time]);

  const checkMobile = () => {
    return window.innerWidth < 1200;
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        style={{
          display: "flex",
          flexDirection: "column",
          width: checkMobile() ? "60vw" : "15vw",
          height: checkMobile() ? "40vh" : "20vh",
          background: "rgb(70,70,70)",
          color: "lightgray",
          padding: "5%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <IconButton>
          <ErrorOutlineIcon
            style={{ fontSize: "300%", color: "rgb(186, 125, 125)" }}
          />
        </IconButton>
        <h2 style={{ padding: 0, margin: 0 }}>Error</h2>
        <h3 style={{ color: "gray", padding: 0, margin: 0 }}>
          Returning you to home in {timeout - time}...
        </h3>
      </Paper>
    </div>
  );
};

export default Error;
