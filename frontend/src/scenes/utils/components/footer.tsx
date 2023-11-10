import React from "react";
import { IconButton } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import CodeIcon from "@mui/icons-material/Code";

const Footer = () => {
  return (
    <div
      id="footer"
      style={{
        background: "rgb(50, 50, 50)",
        height: "fit-content",
        width: "100vw",
        color: "lightgray",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "98%",
          display: "flex",
          padding: "0 1%",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "80%",
            color: "gray",
          }}
        >
          @ 2023 Sanitize.gg. All Rights Reserved.
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconButton
            onClick={() => {
              window.location.href =
                "https://www.linkedin.com/in/eyad-kamil-157713266/";
            }}
          >
            <LinkedInIcon
              style={{
                height: "25px",
                width: "25px",
                borderRadius: "5px",
                background: "lightgray",
                color: "rgb(50, 50, 50)",
              }}
            />
          </IconButton>
          <IconButton
            onClick={() => {
              window.location.href = "https://www.github.com/eykam";
            }}
          >
            <GitHubIcon
              style={{
                height: "25px",
                width: "25px",
                borderRadius: "5px",
                background: "lightgray",
                color: "rgb(50, 50, 50)",
              }}
            />
          </IconButton>
          <IconButton
            onClick={() => {
              window.location.href = "https://www.tinyurl.com/ekamil";
            }}
          >
            <CodeIcon
              style={{
                height: "25px",
                width: "25px",
                borderRadius: "5px",
                background: "lightgray",
                color: "rgb(50, 50, 50)",
              }}
            />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default Footer;
