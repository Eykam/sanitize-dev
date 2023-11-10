import React, { SyntheticEvent, useRef, useState } from "react";
import { useAppDispatch } from "../../../../store/store";
import { checkFileType } from "../../../../types/fileTypes";
import {
  hideFileInput,
  componentIDs,
  showSubmitForm,
  hideDescription,
  hideFAQ,
  showDashboard,
} from "../../../../store/features/formSlice";
import "../../css/fileInputForm.css";
import {
  uploadFile,
  createFileUpload,
} from "../../../../store/features/fileSlice";
import Toggle from "../../../utils/components/toggle";
import Button from "@mui/material/Button";
import { CloudUpload } from "@mui/icons-material";

const FileInputForm = () => {
  //--------------------------------------------------- States ------------------------------------------------------
  const [dragActive, setDragActive] = useState(false);

  //--------------------------------------------------- Refs --------------------------------------------------------
  const formRef = useRef<HTMLFormElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const boxRef = useRef<HTMLLabelElement | null>(null);

  //--------------------------------------------------- Functions ---------------------------------------------------
  const dispatch = useAppDispatch();

  //Handles whether or not dragging is currently active & updates state
  const handleDrag = (e: SyntheticEvent<EventTarget>): void => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  //Handles what occurs when item is dropped in input box
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer?.files[0];
    if (file) handleFile(file);
    console.log("Event: ", e);
  };

  //Handles what occurs when input element is given a file
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const files = e.target.files;
    if (files) handleFile(files[0]);

    e.target.value = "";
  };

  //Allows pop-up box to select file by clicking the input
  const onButtonClick = (e: SyntheticEvent<EventTarget>) => {
    if (inputRef.current) inputRef.current.click();
  };

  //Handles what happens after file is uploaded, first checks if file is valid type
  //Stores file in redux if valid, else tells user to select another file
  const handleFile = (file: File) => {
    if (file.type && checkFileType(file.type)) {
      storeFile(file);
      if (inputRef.current) inputRef.current.value = "";
    } else {
      displayInvalidFile(file);
    }
  };

  //takes a file, turns it into a FileUpload object, then dispatches uploadFile
  //action with given FileUpload
  const storeFile = (file: File) => {
    dispatch(uploadFile(createFileUpload(file)));
    hideForm();
  };

  //Hides form after FileUpload is successfully stored
  const hideForm = () => {
    dispatch(hideFileInput());
    // dispatch(hideDescription());
    // dispatch(hideFAQ());
    dispatch(showSubmitForm());
    // dispatch(showDashboard());
  };

  //Function to edit inputbox to display error if selected file is invalid
  const displayInvalidFile = (file: File) => {
    if (boxRef.current) {
      boxRef.current.style.backgroundColor = "hsla(360, 100%, 50%, 0.18)";
      boxRef.current.innerHTML = `Please enter a valid file type: ${file.type}`;
    }
  };

  //--------------------------------------------------- UI ------------------------------------------------------
  return (
    <Toggle id={componentIDs.fileInput}>
      <form
        id="form-file-upload"
        onDragEnter={handleDrag}
        onSubmit={(e) => e.preventDefault()}
        ref={formRef}
      >
        <input
          type="file"
          key={Date.now()}
          id="input-file-upload"
          multiple={false}
          onChange={handleChange}
          ref={inputRef}
        />
        <label
          ref={boxRef}
          id="label-file-upload"
          htmlFor="input-file-upload"
          className={dragActive ? "drag-active" : ""}
        >
          <div className="input-box">
            <p style={{ marginBottom: "0" }}>
              Drag and drop your file here
              <br />
              or
            </p>
            {/* <button className="upload-button" onClick={onButtonClick}>
              Upload a file
            </button>
             */}
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUpload />}
              onClick={onButtonClick}
              style={{ backgroundColor: "rgb(100,100,100)" }}
            >
              Upload file
            </Button>
          </div>
        </label>
        {dragActive && (
          <div
            id="drag-file-element"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={onButtonClick}
          ></div>
        )}
      </form>
    </Toggle>
  );
};

export default FileInputForm;
