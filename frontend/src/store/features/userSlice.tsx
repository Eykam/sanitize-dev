import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { JwtPayload } from "jwt-decode";
import { fetchWithCSRF } from "../store";

// const BASEURL = "http://192.168.1.171:8800";
// const BASEURL = "https://driven-fowl-privately.ngrok-free.app";
const BASEURL = "/api";

export enum UserEndpoints {
  login = "/login/google",
  checkLoggedIn = "/exists",
  logout = "/logout",
}

export interface RequestHistory {
  filename: string;
  uuid: string;
  type: string;
  timestamp: string;
  tokensBefore: number;
  size: number;
}

export interface UserDetails {
  google_id: string;
  name: string;
  gmail: string;
  verified: boolean;
  picture: string;
  locale: string;
  tokens: number;
  registerDate: number;
  new: boolean;
  csrf: string;
  uuid: string;
  tokenLimit: number;
  request: RequestHistory[];
  nextRefresh: string;
}

export interface BooleanResponse {
  success: boolean;
}

export interface LoginResponse {
  [index: string]: string;
}

export interface GetTokensResponse {
  [index: string]: string;
}

export const checkLoggedIn = createAsyncThunk(
  "user/checkLoggedIn",
  async (empty: null = null, { rejectWithValue, fulfillWithValue }) => {
    try {
      const res = await fetch(BASEURL + UserEndpoints.checkLoggedIn, {
        method: "post",
        credentials: "include",
      });

      if (res.status === 200) {
        const currUser = (await res.json()) as UserDetails;
        console.log("user", currUser);
        return fulfillWithValue(currUser);
      } else rejectWithValue(new Error("empty response from auth server"));
    } catch (e) {
      console.log("Error Logging in:", (e as Error).message);
      return rejectWithValue(e as Error);
    }
  }
);

export const logout = createAsyncThunk(
  "user/logout",
  async (empty: null = null, { rejectWithValue, fulfillWithValue }) => {
    try {
      const res = await fetchWithCSRF(BASEURL + UserEndpoints.logout, {
        method: "post",
      });
      // const res = await fetch(BASEURL + UserEndpoints.logout, {
      //   method: "post",
      //   credentials: "include",
      // });

      console.log("Logout response", res);

      if (res.status === 200) {
        return fulfillWithValue(true);
      } else return rejectWithValue("Failed to log out");
    } catch (e) {
      console.log("Error Logging out:", (e as Error).message);
      return rejectWithValue(e as Error);
    }
  }
);

// export const deleteUser = createAsyncThunk(
//   "user/deleteUser",
//   async (token: string, { rejectWithValue, fulfillWithValue }) => {
//     if (token !== "") {
//       try {
//         let res = await fetch(BASEURL + UserEndpoints.deleteUser, {
//           method: "POST",
//           body: token,
//         });
//         let status = (await res.json()) as BooleanResponse;

//         if (status["success"]) return fulfillWithValue(true);
//         else return rejectWithValue("Failed to log out");
//       } catch (e) {
//         console.log("Error Logging in:", (e as Error).message);
//         return rejectWithValue(e as Error);
//       }
//     }
//   }
// );

const initialState: {
  userDetails: UserDetails | null;
  login_url: string;
} = {
  userDetails: null,
  login_url: BASEURL + UserEndpoints.login,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<UserDetails>) => {
      state.userDetails = payload;
    },
    setTokens: (state, { payload }: PayloadAction<number>) => {
      if (state.userDetails) state.userDetails.tokens = payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(checkLoggedIn.fulfilled, (state, action) => {
      if (action.payload) {
        const nextRefresh = Number(action.payload.nextRefresh) * 1000;

        console.log("nextRefresh");
        let date = new Date();
        let dateString = new Date(date.getTime() + nextRefresh).toString();

        console.log("nextRefreshValue" + dateString);

        state.userDetails = action.payload;
        state.userDetails["nextRefresh"] = dateString;
        console.log("User Details:", action.payload);
      }
    });
    builder.addCase(checkLoggedIn.rejected, (state, action) => {
      console.log("CheckLoggedIn rejected. Deleting userDetails...");
      console.log(action.payload);
      state.userDetails = null;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      console.log("Logout fulfilled. Deleting userDetails...");
      if (action.payload) {
        state.userDetails = null;
      }
    });
    builder.addCase(logout.rejected, (state, action) => {
      console.log("Logout rejected. Deleting userDetails...");
      console.log(action.payload);
      state.userDetails = null;
    });
    // builder.addCase(deleteUser.fulfilled, (state, action) => {
    //   if (action.payload) {
    //     state.loggedIn = false;
    //     state.userDetails = null;
    //     state.token = "";
    //   }
    // });
  },
});

export default userSlice.reducer;
export const { setTokens, setUser } = userSlice.actions;
