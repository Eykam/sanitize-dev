import React, { useState, useEffect } from "react";
import { Paper, Box, IconButton } from "@mui/material";
import CloudDoneIcon from "@mui/icons-material/CloudDone";

const Redirect = ({
  message,
  timeout,
}: {
  message: string;
  timeout: number;
}) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    setTimeout(function () {
      if (time < timeout) setTime((prev) => prev + 1);
      else window.location.reload();
    }, 1000);
  }, [time]);

  const checkMobile = () => {
    return window.innerWidth < 1200;
  };

  return (
    <Paper
      style={{
        display: "flex",
        flexDirection: "column",
        width: checkMobile() ? "60vw" : "30vw",
        height: checkMobile() ? "40vh" : "30vh",
        background: "rgb(70,70,70)",
        color: "lightgray",
        padding: "5%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <IconButton>
        <CloudDoneIcon
          style={{ fontSize: "300%", color: "rgb(125, 186, 143)" }}
        />
      </IconButton>
      <h2 style={{ padding: 0, margin: 0 }}>{message}</h2>
      <h3 style={{ color: "gray", padding: 0, margin: 0 }}>
        Returning you to home in {timeout - time}...
      </h3>
    </Paper>
  );
};

export default Redirect;
