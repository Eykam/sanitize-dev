import React, { useState, useEffect } from "react";
import { Paper, Box, IconButton } from "@mui/material";
import CreditCardOffIcon from "@mui/icons-material/CreditCardOff";

const UpgradeMessage = () => {
  const timeout = 6;
  const [time, setTime] = useState(0);

  useEffect(() => {
    setTimeout(function () {
      if (time < timeout) setTime((prev) => prev + 1);
      else window.location.href = "/upgrade";
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
          boxShadow: "rgba(0, 0, 0, 0.5) 0px 5px 10px",
        }}
      >
        <IconButton>
          <CreditCardOffIcon
            style={{ fontSize: "300%", color: "rgb(186, 125, 125)" }}
          />
        </IconButton>
        <h2 style={{ padding: 0, margin: 0 }}>Out of tokens</h2>
        <h3 style={{ color: "gray", padding: 0, margin: 0 }}>
          Please upgrade your plan, or wait for your next token refresh!
          <br />
          <br />
          Returning you to home in {timeout - time}...
        </h3>
      </Paper>
    </div>
  );
};

export default UpgradeMessage;
