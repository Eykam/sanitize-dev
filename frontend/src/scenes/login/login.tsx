import React from "react";
import { Paper, Button, Box } from "@mui/material";
import Divider from "@mui/material/Divider";
import GoogleIcon from "@mui/icons-material/Google";
import { useAppSelector } from "../../store/store";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const LOGIN_URL = useAppSelector((state) => state.user.login_url);

  const navigate = useNavigate();
  const checkMobile = () => {
    return window.innerWidth < 1200;
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
    >
      <Paper
        style={{
          display: "flex",
          flexDirection: "column",
          width: checkMobile() ? "70vw" : "15vw",
          height: checkMobile() ? "50vh" : "40vh",
          background: "rgb(70,70,70)",
          color: "lightgray",
          margin: "2%",
          // padding: "10% 0",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
        }}
      >
        <IconButton
          onClick={() => {
            navigate("/");
          }}
          id="back-button"
          aria-label="back-button"
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            padding: "0",
            margin: "1%",
          }}
        >
          <CloseIcon />
        </IconButton>

        <div
          style={{
            height: "100%",
            width: checkMobile() ? "80%" : "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ height: "20%", width: "100%", margin: "5% 0" }}>
              <h1 style={{ margin: 0, padding: 0 }}> Sign in </h1>
              <p
                style={{
                  maxWidth: "100%",
                  margin: 0,
                  padding: 0,
                  color: "gray",
                  fontSize: "80%",
                }}
              >
                To continue using our app, please log in!
              </p>
            </div>

            <a
              href={LOGIN_URL}
              style={{
                width: "100%",
                textDecoration: "none",
              }}
            >
              <Button
                variant="outlined"
                style={{
                  display: "flex",
                  width: "100%",
                  borderColor: "lightgray",
                  color: "lightgray",
                  // padding: "3% 3%",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    width: "100%",
                    height: "100%",
                    fontSize: "100%",
                    // margin: "auto",
                    alignItems: "center",
                    // justifyContent: "space-between",
                  }}
                >
                  <GoogleIcon style={{ width: "10%" }} />
                  <strong
                    style={{
                      margin: "auto 0",
                      width: "90%",
                    }}
                  >
                    Sign in
                  </strong>
                </span>
              </Button>
            </a>

            <Divider
              style={{ width: "80%", margin: "5% auto", marginTop: "10%" }}
              flexItem
            >
              or
            </Divider>

            <div style={{ width: "100%", margin: "5% 0" }}>
              <h1 style={{ margin: 0, padding: 0 }}> Register </h1>
              <p
                style={{
                  maxWidth: "100%",
                  margin: 0,
                  padding: 0,
                  color: "gray",
                  fontSize: "80%",
                }}
              >
                Use your google account to register
              </p>
            </div>

            <a
              href={LOGIN_URL}
              style={{
                width: "100%",
                textDecoration: "none",
              }}
            >
              <Button
                variant="outlined"
                style={{
                  display: "flex",
                  width: "100%",
                  borderColor: "lightgray",
                  color: "lightgray",
                  // padding: "3% 3%",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    width: "100%",
                    height: "100%",
                    fontSize: "100%",
                    // margin: "auto",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <GoogleIcon style={{ width: "10%" }} />
                  <strong
                    style={{
                      margin: "auto 0",
                      width: "90%",
                    }}
                  >
                    Register
                  </strong>
                </span>
              </Button>
            </a>
          </div>
        </div>
      </Paper>
    </Box>
  );
};

export default Login;
