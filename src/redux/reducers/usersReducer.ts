import { PayloadAction, createAction, createAsyncThunk, createSlice, isAction } from "@reduxjs/toolkit";
import axios, { Axios, AxiosError } from "axios";
import { User } from "../../types/User";
import { baseApi } from "../common/baseApi";
import { NewUser } from "../../types/NewUser";

interface UserReducer {
  users: User[];
  currentUser?: User;
  newUser: NewUser;
  loading: boolean;
  error: string;
}

const initialState: UserReducer = {
  users: [],
  loading: false,
  error: "",
  newUser: {
    name: "",
    email: "",
    password: "",
    avatar: "",
    age: 0
  },
  currentUser: {
    name: "",
    email: "",
    avatar: "",
    password: "",
    role: "Client",
    age: 0
  },
};

interface FetchQuery {
  page: number;
  per_page: number;
}

interface thunkAPI {
  username: string;
  password: string;
}

interface TokenResponse {
  token: string;
}

interface DecodedToken {
  name: string;
}

export const setCurrentUser = createAction<User>("users/setCurrentUser");

export const fetchAllUsers = createAsyncThunk(
    "fetchAllUsers",
    async () => {
        try {
            const result = await axios.get<User[]>(`${baseApi}/users`)
            return result.data
        } catch (e) {
            const error = e as AxiosError
            if(error.request) {
                return error.request
            } else {
                return error.response?.data
            }
        }
    }
)

export const fetchLoggedInUserProfile = createAsyncThunk(
  "fetchLoggedInUserProfile",
  async () => {
      try {
        const ProfileToken = localStorage.getItem('loginResponse')
        const resultToken = ProfileToken && JSON.parse(ProfileToken)
          const result = await axios.get<User[]>(`${baseApi}/users/profile`, { headers: { Authorization: `Bearer ${resultToken}` } })
          return result.data
      } catch (e) {
          const error = e as AxiosError
          if(error.request) {
              return error.request
          } else {
              return error.response?.data
          }
      }
  }
)

export const createOneUser = createAsyncThunk(
    "createOneUser", 
    async({email, password, name, avatar, age}: NewUser) => {
    try {
      const result = await axios.post<NewUser>(`${baseApi}/users`, { email: email, password: password, name: name, avatar: avatar, age: age })
      return result.data
    } catch (e) {
      const error = e as AxiosError
      return error
    }
    }
  )

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        createUser: (state, action: PayloadAction<User>) => {
            state.users.push(action.payload)
        },
    },
    extraReducers: (build) => {
        build
          .addCase(fetchAllUsers.fulfilled, (state, action) => {
            if (action.payload instanceof AxiosError) {
              state.error = action.payload.message;
            } else {
              state.users = action.payload || [];
            }
          })
          .addCase(fetchAllUsers.pending, (state, action) => {
            state.loading = true;
          })
          .addCase(fetchAllUsers.rejected, (state, action) => {
            state.error = "Cannot fetch data";
          })
          .addCase(createOneUser.fulfilled, (state, action) => {
            if (action.payload instanceof AxiosError) {
              state.error = action.payload.message
            } else {
              state.newUser = action.payload
            }
          })
          .addCase(createOneUser.pending, (state) => {
            state.loading = true;
          })
          .addCase(createOneUser.rejected, (state) => {
            state.error = "User cannot be update at the moment, try again later.";
          })
          .addCase(fetchLoggedInUserProfile.fulfilled, (state, action) => {
            if (action.payload instanceof AxiosError) {
              state.error = action.payload.message
            } else {
              state.currentUser = action.payload
              state.loading = false;
            }
          })
          .addCase(fetchLoggedInUserProfile.pending, (state) => {
            state.loading = true;
          })
          .addCase(fetchLoggedInUserProfile.rejected, (state) => {
            state.error = "Profile page is not available to the moment, please try again later.";
          })
      },
})

const userReducer = usersSlice.reducer

export const {createUser } = usersSlice.actions

export default userReducer