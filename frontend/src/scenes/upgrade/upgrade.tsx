import React from "react";
import { Paper, Box, Button } from "@mui/material";
import { useAppSelector } from "../../store/store";

interface TierInfo {
  limit: string;
  cost: string;
  onClick: () => void;
}

const Upgrade = () => {
  const user = useAppSelector((state) => state.user.userDetails);
  const checkMobile = () => {
    return window.innerWidth < 1200;
  };

  const selectFree = () => {
    if (user) window.location.href = "/";
    else window.location.href = "/login";
  };

  const TIER_INFO: { [index: string]: TierInfo } = {
    free: { limit: "100MB", cost: "$0.00", onClick: selectFree },
  };

  const TierComponent = ({ tier }: { tier: string }) => {
    const tierInfo = TIER_INFO[tier];
    const clickHandler = tierInfo ? tierInfo.onClick : selectFree;

    return (
      <Box gridColumn="span 2">
        <Paper
          style={{
            display: "flex",
            flexDirection: "column",
            width: checkMobile() ? "60vw" : "15vw",
            height: checkMobile() ? "40vh" : "50vh",
            background: "rgb(70,70,70)",
            color: "lightgray",
            boxShadow: "rgba(0, 0, 0, 0.5) 0px 5px 15px",
            // alignItems: "center",
          }}
        >
          <h2 style={{ padding: "0", margin: "3%" }}> {tier} </h2>
          <span
            style={{
              color: "rgb(120,120,120)",
              fontWeight: "bolder",
              height: "80%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {" "}
            Coming Soon...
          </span>

          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              variant="outlined"
              style={{
                color: "lightgray",
                borderColor: "lightgray",
                width: "70%",
                // display: "flex",
                // alignItems: "center",
                // justifyContent: "center",
              }}
              onClick={clickHandler}
            >
              Select Plan
            </Button>
          </div>
        </Paper>
      </Box>
    );
  };

  return (
    <Box
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      display="grid"
      gridTemplateColumns="repeat(6,1fr)"
      gap="2%"
    >
      <TierComponent tier="Free" />
      <TierComponent tier="Pro" />
      <TierComponent tier="Enterprise" />
    </Box>
  );
};

export default Upgrade;
