import React, { SyntheticEvent, useEffect, useRef, useState } from "react";
import "../../css/submitForm.css";
import Toggle from "../../../utils/components/toggle";
import FileInfo from "./fileInfo";
import {
  componentIDs,
  hideFileInfo,
  showFileInfo,
} from "../../../../store/features/formSlice";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import SubmitSettings from "./transcribeSubmit";
import AudioWave from "../../../utils/components/audioWave";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import NotificationsOffOutlinedIcon from "@mui/icons-material/NotificationsOffOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

const SubmitForm = () => {
  const dispatch = useAppDispatch();

  const [notifications, setNotifications] = useState(false);
  const transcriptionStatus = useAppSelector(
    (state) => state.data.transcription.status
  );

  const back = (e: SyntheticEvent) => {
    window.location.reload();
  };

  const checkBrowser = () => {
    return window.innerWidth < 1200;
  };

  const askNotificationPermission = (e: SyntheticEvent) => {
    // function to actually ask the permissions
    const handlePermission = (permission: NotificationPermission) => {
      // set the button to shown or hidden, depending on what the user answers

      if (Notification.permission === "granted") {
        setNotifications(true);
      } else {
        setNotifications(false);
      }
    };

    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications.");
    } else {
      Notification.requestPermission().then((permission) => {
        handlePermission(permission);
      });
    }
  };

  useEffect(() => {
    dispatch(showFileInfo());
  });

  return (
    <Toggle id={componentIDs.submitForm}>
      {checkBrowser() ? (
        <div id="submit-form" className="mobile-submit-form ">
          <div
            style={{
              display: "flex",
              paddingTop: "0%",
            }}
          >
            <h1>Analyzing Audio</h1>
            <AudioWave />
          </div>

          <div style={{ display: "block" }}>
            <FileInfo />
          </div>

          <SubmitSettings />

          <br />
        </div>
      ) : (
        <div
          id="submit-form"
          className="submit-form form-outer"
          style={{
            maxWidth: "40vw",
            minWidth: "40vw",
            maxHeight: "90%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <IconButton
            onClick={back}
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

          <IconButton
            aria-label="get notifications"
            style={{
              position: "absolute",
              top: "0",
              right: "0",
              background: "rgb(100, 100, 100)",
              padding: "1%",
              margin: "1%",
              color: notifications
                ? "rgb(125, 186, 143)"
                : "rgb(186, 125, 125)",
            }}
            // color={notifications ? "success" : "error"}
            onClick={(e) => {
              askNotificationPermission(e);
            }}
          >
            {notifications ? (
              <NotificationsNoneOutlinedIcon />
            ) : (
              <NotificationsOffOutlinedIcon />
            )}
          </IconButton>

          <div style={{ display: "flex", alignItems: "center" }}>
            <h1>Analyzing Audio</h1>
            <AudioWave />
          </div>

          <div
            style={{
              display: "flex",
              height: "90%",
              margin: "0 auto",
              maxWidth: "100%",
              minWidth: "100%",
            }}
          >
            <FileInfo />
          </div>

          <SubmitSettings />
        </div>
      )}
    </Toggle>
  );
};

export default SubmitForm;
