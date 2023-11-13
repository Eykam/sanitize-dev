import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { FileUpload } from "./fileSlice";
import { fetchWithCSRF } from "../store";

// const BASEURL = "http://192.168.1.171:8800";
// const BASEURL = "https://driven-fowl-privately.ngrok-free.app";
const BASEURL = "/api/auth";
const CENSOR_THRESHOLD = 0.65;

export enum endpoints {
  sendFile = "/file",
  fetchTranscription = "/fetchTranscription",
  fetchCensorship = "/fetchCensorship",
}

export enum Mode {
  auto = "auto",
  manual = "manual",
}

export enum RequestStates {
  idle = "idle",
  pending = "pending",
  success = "success",
  error = "error",
}

interface StringMap {
  [name: string]: string;
}

export interface CensorMap {
  entries: { [index: string]: number[][] };
}

export interface TranscriptionResponse {
  data: [{ text: string; start: number; end: number }];
  requestTime: string;
  badWords: { [index: string]: { percentage: number; reason: string } };
}

interface DataState {
  uuid?: String;
  sendFile: {
    response?: {
      message: String;
      body: { size: number; type: string; uuid: string };
    };
    status: RequestStates;
    error?: Error;
  };
  transcription: {
    data?: StringMap;
    response?: TranscriptionResponse;
    status: RequestStates;
    error?: Error;
  };
  censorship: {
    censorList?: { [index: string]: number[][] };
    censorURL: string;
    status: RequestStates;
    error?: Error;
  };
  unselectedWords: { [index: string]: number[][] };
  originalWordList: { [index: string]: number[][] };
  suggestedWords: { [index: string]: number[][] };
  originalSuggestedWords: { [index: string]: number[][] };
}

function generateUUID() {
  // Public Domain/MIT
  var d = new Date().getTime(); //Timestamp
  var d2 =
    (typeof performance !== "undefined" &&
      performance.now &&
      performance.now() * 1000) ||
    0; //Time in microseconds since page-load or 0 if unsupported
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export const urlToFile = async (file: FileUpload): Promise<File | Error> => {
  try {
    console.log("urlToFile executing...");
    let data = await fetch(file.fileUrl);
    let blob = await data.blob();

    let currFile = new File([blob], file.fileName, { type: file.fileType });
    console.log("urlTOFile: ", currFile);
    return currFile;
  } catch (e) {
    return e as Error;
  }
};

export const sendFile = createAsyncThunk(
  "file/sendFile",
  async (
    { file, uuid }: { file: File; uuid: string },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      if (file != null && file.name !== "") {
        const formData = new FormData();
        formData.append("uuid", uuid);
        formData.append("file", file);

        let data = await fetchWithCSRF(BASEURL + endpoints.sendFile, {
          method: "POST",
          headers: {
            // "ngrok-skip-browser-warning": "true",
            size: String(file.size / 1000000),
          },
          //Dont forget to remove and figure out problem
          // mode: "cors",
          body: formData,
        });

        console.log("Sendfile data: ", data);
        if (data.status === 402) return rejectWithValue(402);

        return fulfillWithValue(await data.text());
      }

      console.log("Either no file or empty file name");
      return rejectWithValue(400);
    } catch (e) {
      console.log("Error in sendfile:", e);
      return rejectWithValue(400);
    }
  }
);

export const fetchTranscription = createAsyncThunk(
  "file/fetchTranscription",
  async (
    args: { mode: Mode; uuid: String; contentType: String },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      if (args.uuid != null && args.uuid !== "") {
        let body = JSON.stringify({
          filename: args.uuid,
          mode: args.mode,
          contentType: args.contentType,
        });
        console.log("Transcription Body: ", body);
        let data = await fetchWithCSRF(BASEURL + endpoints.fetchTranscription, {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          // //Dont forget to remove and figure out problem
          // mode: "cors",
          body: body,
        });

        if (data.status === 400) return rejectWithValue(new Error("Error"));
        let res = (await data.json()) as TranscriptionResponse;

        return fulfillWithValue(res);
      } else {
        rejectWithValue(new Error("File UUID null or empty string"));
      }
    } catch (e) {
      return rejectWithValue(e as Error);
    }
  }
);

export const fetchCensorship = createAsyncThunk(
  "file/fetchCensorship",
  async (
    args: { filename: string; badWords: { [index: string]: number[][] } },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const body = JSON.stringify(args);

      let data = await fetchWithCSRF(BASEURL + endpoints.fetchCensorship, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        // //Dont forget to remove and figure out problem
        // mode: "cors",
        body: body,
      });

      if (data.status === 400) return rejectWithValue(new Error("Error"));

      const censoredBlob = await data.blob();
      const censoredURL = URL.createObjectURL(censoredBlob);

      console.log("FetchCensorship: ", censoredURL);

      return fulfillWithValue(censoredURL);
    } catch (e) {
      console.log("Error", (e as Error).message);
      return rejectWithValue(e as Error);
    }
  }
);

const initialState: DataState = {
  sendFile: {
    status: RequestStates.idle,
  },
  transcription: {
    status: RequestStates.idle,
  },
  censorship: {
    status: RequestStates.idle,
    censorURL: "",
  },
  unselectedWords: {},
  originalWordList: {},
  suggestedWords: {},
  originalSuggestedWords: {},
};

export const dataSlice = createSlice({
  name: "data",
  initialState: initialState,
  reducers: {
    setUnselectedWords: (state, { payload }: PayloadAction<CensorMap>) => {
      state.unselectedWords = payload.entries;
      state.originalWordList = payload.entries;

      Object.keys(payload.entries).forEach((currWord) => {
        if (
          state.transcription.response != null &&
          state.transcription.response.badWords !== undefined
        ) {
          if (
            state.transcription.response.badWords[currWord] !== undefined &&
            state.transcription.response.badWords[currWord]["percentage"] >=
              CENSOR_THRESHOLD
          ) {
            state.suggestedWords[currWord] = payload.entries[currWord];
            delete state.unselectedWords[currWord];
          }
        }
      });

      state.originalSuggestedWords = state.suggestedWords;
    },

    addCensorWords: (state, { payload }: PayloadAction<CensorMap>) => {
      //go through censorList, if word exists already, add timestamps, if word doesnt exist add word to censorList
      if (
        state.censorship.censorList === undefined &&
        payload.entries !== undefined
      ) {
        state.censorship.censorList = payload.entries;
      } else if (
        state.censorship.censorList !== undefined &&
        payload.entries !== undefined
      ) {
        const addList = payload.entries;
        const currList = state.censorship.censorList;

        Object.keys(addList).forEach((currWord) => {
          if (currList !== undefined && currList[currWord] !== undefined) {
            addList[currWord].forEach((currTime) => {
              currList[currWord].push(currTime);
            });
          } else {
            currList[currWord] = addList[currWord];
          }
        });
      }
    },

    addUnselectedWords: (state, { payload }: PayloadAction<CensorMap>) => {
      if (
        state.unselectedWords === undefined &&
        payload.entries !== undefined
      ) {
        state.unselectedWords = payload.entries;
      } else if (
        state.unselectedWords !== undefined &&
        payload.entries !== undefined
      ) {
        const addList = payload.entries;
        const currList = state.unselectedWords;

        Object.keys(addList).forEach((currWord) => {
          if (currList !== undefined && currList[currWord] !== undefined) {
            addList[currWord].forEach((currTime) => {
              currList[currWord].push(currTime);
            });
          } else {
            currList[currWord] = addList[currWord];
          }
        });
      }
    },

    addSuggestedWords: (state, { payload }: PayloadAction<CensorMap>) => {
      if (state.suggestedWords === undefined && payload.entries !== undefined) {
        state.suggestedWords = payload.entries;
      } else if (
        state.suggestedWords !== undefined &&
        payload.entries !== undefined
      ) {
        const addList = payload.entries;
        const currList = state.suggestedWords;

        Object.keys(addList).forEach((currWord) => {
          if (currList !== undefined && currList[currWord] !== undefined) {
            addList[currWord].forEach((currTime) => {
              currList[currWord].push(currTime);
            });
          } else {
            currList[currWord] = addList[currWord];
          }
        });
      }
    },

    removeSuggestedWords: (
      state,
      {
        payload,
      }: PayloadAction<{
        currWord: string;
        removeTimestamp: number[];
        all: boolean;
      }>
    ) => {
      if (payload.all) {
        delete state.suggestedWords[payload.currWord];
      } else {
        state.suggestedWords[payload.currWord] = state.suggestedWords[
          payload.currWord
        ].filter(
          (currTimestamp) =>
            JSON.stringify(currTimestamp) !==
            JSON.stringify(payload.removeTimestamp)
        );
      }
    },

    removeUnselectedWords: (
      state,
      {
        payload,
      }: PayloadAction<{
        currWord: string;
        removeTimestamp: number[];
        all: boolean;
      }>
    ) => {
      if (payload.all) {
        delete state.unselectedWords[payload.currWord];
      } else {
        state.unselectedWords[payload.currWord] = state.unselectedWords[
          payload.currWord
        ].filter(
          (currTimestamp) =>
            JSON.stringify(currTimestamp) !==
            JSON.stringify(payload.removeTimestamp)
        );
      }
    },

    removeSelectedWords: (
      state,
      {
        payload,
      }: PayloadAction<{
        currWord: string;
        removeTimestamp: number[];
        all: boolean;
      }>
    ) => {
      if (state.censorship.censorList !== undefined) {
        if (payload.all) {
          delete state.censorship.censorList[payload.currWord];
        } else {
          state.censorship.censorList[payload.currWord] =
            state.censorship.censorList[payload.currWord].filter(
              (currTimestamp) =>
                JSON.stringify(currTimestamp) !==
                JSON.stringify(payload.removeTimestamp)
            );
        }
      }
    },

    resetWordList: (state) => {
      state.unselectedWords = state.originalWordList;
      state.suggestedWords = state.originalSuggestedWords;
      state.censorship.censorList = {};
    },
    backButtonData: (state) => {
      return initialState;
    },
  },

  extraReducers(builder) {
    builder.addCase(sendFile.pending, (state: DataState, action) => {
      console.log("sendFile pending...");
      state.sendFile.status = RequestStates.pending;
    });

    builder.addCase(sendFile.fulfilled, (state: DataState, action) => {
      console.log("sendFile fulfilled...");
      state.sendFile.status = RequestStates.success;
      let res = JSON.parse(action.payload);
      state.sendFile.response = res;
      state.uuid = res.uuid;
    });

    builder.addCase(sendFile.rejected, (state: DataState, action) => {
      console.log("sendFile rejected...");
      const status = action.payload as Number;
      console.log("Error: ", status);
      state.sendFile.status = RequestStates.error;
      if (status === 402) window.location.href = "/limited";
      else window.location.href = "/error";
    });

    builder.addCase(fetchTranscription.pending, (state: DataState, action) => {
      console.log("fetchTranscription pending...");
      state.transcription.status = RequestStates.pending;
    });

    builder.addCase(
      fetchTranscription.fulfilled,
      (state: DataState, action) => {
        console.log("fetchTranscription fulfilled...");
        state.transcription.status = RequestStates.success;
        console.log("Transcription payload: ", action.payload);
        if (action.payload !== undefined)
          state.transcription.response = action.payload;
      }
    );

    builder.addCase(fetchTranscription.rejected, (state: DataState, action) => {
      console.log("fetchTranscription rejected...");
      console.log("Error: ", action.payload);
      state.transcription.status = RequestStates.error;
      state.transcription.error = action.payload as Error;
      window.location.href = "/error";
    });

    builder.addCase(fetchCensorship.pending, (state: DataState, action) => {
      console.log("fetchCensorship pending...");
      state.censorship.status = RequestStates.pending;
    });

    builder.addCase(fetchCensorship.fulfilled, (state: DataState, action) => {
      console.log("fetchCensorship fulfilled...");
      state.censorship.status = RequestStates.success;
      if (action.payload !== undefined)
        state.censorship.censorURL = action.payload;
    });

    builder.addCase(fetchCensorship.rejected, (state: DataState, action) => {
      console.log("fetchCensorship rejected...");
      console.log("Error: ", action.payload);
      state.censorship.status = RequestStates.error;
      state.censorship.error = action.payload as Error;
      window.location.href = "/error";
    });
  },
});

export default dataSlice.reducer;
export const {
  addCensorWords,
  addUnselectedWords,
  addSuggestedWords,
  setUnselectedWords,
  removeUnselectedWords,
  removeSelectedWords,
  removeSuggestedWords,
  resetWordList,
  backButtonData,
} = dataSlice.actions;
