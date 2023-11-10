import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../store/store";
import { FixedSizeList as List } from "react-window";
import { Paper, Box, CircularProgress, Typography } from "@mui/material";
import ListItem from "./ListItem";
import { RequestHistory, checkLoggedIn } from "../../store/features/userSlice";

const Profile = () => {
  const user = useAppSelector((state) => state.user.userDetails);
  const dispatch = useAppDispatch();

  const checkMobile = () => {
    return window.innerWidth <= 1200;
  };

  const checkBrowser = () => {
    return window.innerWidth <= 1500;
  };

  const calculateColor = () => {
    const percentage = user ? user.tokens / user.tokenLimit : 0;

    const hue = (percentage * 120).toString(10);
    return ["hsl(", hue, ",100%,50%)"].join("");
  };

  useEffect(() => {
    dispatch(checkLoggedIn(null));
  }, [dispatch]);

  const TokenDisplay = () => {
    return (
      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress
          variant="determinate"
          size={checkBrowser() ? "6rem" : "8rem"}
          thickness={8}
          color={"success"}
          style={{
            color: calculateColor(),
          }}
          // sx={{
          //   "& .MuiCircularProgress-circle": {
          //     strokeLinecap: "round",
          //   },
          // }}
          value={user ? (user.tokens / user.tokenLimit) * 100 : 0}
        />
        <Box
          sx={{
            marginTop: "5%",
          }}
        >
          <Typography
            variant="caption"
            fontSize="1.5rem"
            fontWeight="bolder"
            color="gray"
          >
            {user ? `${Math.round(user.tokens)}/${user.tokenLimit}` : 0}
          </Typography>
        </Box>
      </Box>
    );
  };

  const rows = ({
    data,
    index,
    style,
  }: {
    data: RequestHistory[];
    index: number;
    style: React.CSSProperties;
  }) => {
    return (
      <div style={style}>
        <ListItem data={data} index={index} />
      </div>
    );
  };

  const transactionsDisplay = () => {
    return user ? (
      <Paper
        style={{
          display: "inline-block",
          width: "98%",
          verticalAlign: "top",
          border: "none",
          boxShadow: "none",
          color: "lightgray",
          marginTop: "2%",
          fontSize: "80%",
          background: "rgb(100,100,100)",
        }}
      >
        <List
          height={checkMobile() ? 100 : checkBrowser() ? 150 : 200}
          width="100%"
          itemCount={user.request.length}
          itemSize={25}
          itemData={user.request}
        >
          {rows}
        </List>
      </Paper>
    ) : (
      <></>
    );
  };

  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(6,1fr)"
      gridTemplateRows="repeat(3, 1fr)"
      gap="20px"
      style={{
        height: "100%",
        width: checkMobile() ? "90%" : "60%",
        padding: "2% 0",
        margin: checkMobile() ? "5% 0" : "0",
      }}
    >
      <Box gridRow="span 1" gridColumn={checkMobile() ? "span 6" : "span 2"}>
        <Paper
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            background: "rgb(60,60,60)",
            borderRadius: "5px",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            boxShadow: "rgba(0, 0, 0, 0.5) 0px 5px 15px",
          }}
        >
          <h2
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              padding: 0,
              margin: "2%",
              color: "lightgray",
            }}
          >
            Tokens
          </h2>

          {TokenDisplay()}
        </Paper>
      </Box>

      <Box gridRow="span 1" gridColumn={checkMobile() ? "span 6" : "span 4"}>
        <Paper
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            background: "rgb(60,60,60)",
            borderRadius: "5px",
            position: "relative",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "rgba(0, 0, 0, 0.5) 0px 5px 15px",
          }}
        >
          <h2
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              padding: 0,
              margin: "1%",
              color: "lightgray",
            }}
          >
            Transactions
          </h2>

          {transactionsDisplay()}
        </Paper>
      </Box>

      <Box gridRow="span 2" gridColumn="span 6">
        <Paper
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            background: "rgb(60,60,60)",
            borderRadius: "5px",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            boxShadow: "rgba(0, 0, 0, 0.5) 0px 5px 15px",
          }}
        >
          <h2
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              padding: 0,
              margin: "1%",
              color: "lightgray",
            }}
          >
            Sessions
          </h2>

          <Typography
            variant="caption"
            fontSize="1.5rem"
            fontWeight="bolder"
            color="rgb(80,80,80)"
          >
            Coming Soon...
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Profile;
