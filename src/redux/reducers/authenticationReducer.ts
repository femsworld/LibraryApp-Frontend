import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserProfile } from "../../types/UserProfile";
import axios, { AxiosError } from "axios";
import { baseApi } from "../common/baseApi";

interface AuthenticationReducer {
  loading: boolean;
  error: string;
  email: string;
  password: string;
  access_token?: string;
  userProfile?: UserProfile | null | undefined;
  isLoggedIn: boolean;
}

export interface loginQuery {
  email: string;
  password: string;
}

const initialState: AuthenticationReducer = {
  loading: false,
  error: "",
  email: "",
  password: "",
  isLoggedIn: false
};

export const userLogin = createAsyncThunk(
  "userLogin",
  async ({ email, password }: loginQuery) => {
    try {
      const result = await axios.post<AuthenticationReducer>(
        `${baseApi}/Auth`, {email, password}
        
      );
      localStorage.setItem("loginResponse", JSON.stringify(result.data));
      const userProfile = await axios.get<UserProfile>(
        `${baseApi}/users/profile`, { headers: { Authorization: `Bearer ${result.data}` } }
      );
      if (userProfile.statusText === "OK"){
        localStorage.setItem("userProfile", JSON.stringify(userProfile.data));
      }
      return {
        access_token: result.data.access_token!,
        userProfile: userProfile.data,
      }; 
    } catch (e) {
      const error = e as AxiosError;
      return error.message;
    }
  }
);

export const userLogout = createAsyncThunk("userLogout", async () => {
    localStorage.clear()
    return null;
  });

const authenticationSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    cleanUpAuthenticationReducer: () => {
      return initialState;
    },
    setCurrentUser: (state, action: PayloadAction<UserProfile>) => {
      state.userProfile = action.payload;
      state.isLoggedIn = true
    },
    currentUserLogOut: (state) => {
      state.userProfile = null;
      state.isLoggedIn = false;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(userLogin.rejected, (state) => {
        state.loading = false;
        state.error =
          "This action cannot be completed at the moment, please try again later";
      })
    .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.access_token = (action.payload as { access_token: string }).access_token;
        state.userProfile = (action.payload as { userProfile: UserProfile }).userProfile;
      })
      .addCase(userLogout.pending, (state) => {
        state.loading = true;
      })
      .addCase(userLogout.fulfilled, () => {
        return initialState;
      });
  },
});

const authenticationReducer = authenticationSlice.reducer;
export const { cleanUpAuthenticationReducer } = authenticationSlice.actions;
export default authenticationReducer
