import { configureStore } from "@reduxjs/toolkit";
import { fileSlice } from "./features/fileSlice";
import { formSlice } from "./features/formSlice";
import { dataSlice } from "./features/dataSlice";
import { userSlice } from "./features/userSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { enableMapSet } from "immer";

enableMapSet();

const updateOptions = (options: RequestInit) => {
  const csrf = localStorage.getItem("csrf");
  let update = { ...options };

  update["credentials"] = "include";
  update["headers"] = {
    ...update.headers,
    "X-CSRF-Header": csrf ? csrf : "",
    "ngrok-skip-browser-warning": "true",
  };

  return update;
};

export const fetchWithCSRF = async (url: string, options: RequestInit) => {
  const newOptions = updateOptions(options);
  console.log("new options on fetchWithCSRF:", newOptions);
  return await fetch(url, newOptions);
};

export const store = configureStore({
  reducer: {
    file: fileSlice.reducer,
    form: formSlice.reducer,
    data: dataSlice.reducer,
    user: userSlice.reducer,
  },
});

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;
