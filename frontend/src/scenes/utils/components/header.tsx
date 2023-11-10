import React from "react";
import { Button } from "@mui/material";
import UserMenu from "../../user/userMenu";
import { JwtPayload } from "jwt-decode";
import { useAppSelector } from "../../../store/store";
import GoogleIcon from "@mui/icons-material/Google";
import { useNavigate } from "react-router-dom";

export interface GoogleLoginPayload extends JwtPayload {
  picture: string;
  email: string;
  name: string;
  locale: string;
}

const Header = () => {
  const navigate = useNavigate();
  const login_url = useAppSelector((state) => state.user.login_url);
  const user = useAppSelector((state) => state.user.userDetails);

  const isMobile = () => {
    return window.innerWidth < 1200;
  };

  const getProfileImage = () => {
    if (user) return user["picture"];
    else return "";
  };

  return (
    <div
      style={{
        width: isMobile() ? "97%" : "98%",
        color: "rgb(226, 226, 226)",
        background: "#111111",
        padding: isMobile() ? "2% 1%" : ".5% 1%",
        display: "flex",
        justifyContent: "space-between",
        borderBottom: "solid 2px rgb(30, 30, 30)",
      }}
    >
      <h2
        style={
          isMobile()
            ? {
                display: "flex",
                margin: "0",
                marginLeft: "4%",
                cursor: "pointer",
                alignItems: "center",
              }
            : {
                display: "flex",
                margin: "0",
                cursor: "pointer",
                alignItems: "center",
              }
        }
        onClick={() => {
          navigate("/");
        }}
      >
        Sanitize.gg
      </h2>

      {user ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <UserMenu img={getProfileImage()} />
        </div>
      ) : (
        <>
          <a
            href={login_url}
            style={{
              width: isMobile() ? "22%" : "8%",
              textDecoration: "none",
            }}
          >
            <Button
              variant="outlined"
              style={{
                display: "flex",
                padding: "0 .5%",
                width: "100%",
                borderColor: "lightgray",
                color: "lightgray",
              }}
            >
              <div
                style={{
                  display: "flex",
                  margin: "0",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <GoogleIcon style={{ padding: "1%" }} />
                <span
                  style={{
                    display: "block",
                    height: "100%",
                    fontSize: "100%",
                    margin: "auto",
                  }}
                >
                  <strong>Log In</strong>
                </span>
              </div>
            </Button>
          </a>
        </>
      )}
    </div>
  );
};

export default Header;
