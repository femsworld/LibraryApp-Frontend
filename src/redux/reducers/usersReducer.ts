import {
  PayloadAction,
  createAction,
  createAsyncThunk,
  createSlice,
  isAction,
} from "@reduxjs/toolkit";
import axios, { Axios, AxiosError } from "axios";
import { User } from "../../types/User";
import { baseApi } from "../common/baseApi";
import { NewUser } from "../../types/NewUser";
import { UserProfile } from "../../types/UserProfile";

interface UserReducer {
  users: User[];
  currentUser?: User|null;
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
    age: 0,
  },
  // currentUser: {
  //   name: "",
  //   email: "",
  //   avatar: "",
  //   password: "",
  //   role: "Client",
  //   age: 0,
  //   id: "",
  // },
  currentUser: null
};

export interface FetchQuery {
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

const ProfileToken = localStorage.getItem("loginResponse");
const resultToken = ProfileToken && JSON.parse(ProfileToken);

export const fetchAllUsers = createAsyncThunk("fetchAllUsers", async () => {
  try {
    const result = await axios.get<User[]>(`${baseApi}/users`,{ headers: { Authorization: `Bearer ${resultToken}` } });
    return result.data;
  } catch (e) {
    const error = e as AxiosError;
    if (error.request) {
      return error.request;
    } else {
      return error.response?.data;
    }
  }
});

export const fetchLoggedInUserProfile = createAsyncThunk(
  "fetchLoggedInUserProfile",
  async () => {
    try {
      const ProfileToken = localStorage.getItem("loginResponse");
      const resultToken = ProfileToken && JSON.parse(ProfileToken);
      const result = await axios.get<User[]>(`${baseApi}/users/profile`, {
        headers: { Authorization: `Bearer ${resultToken}` },
      });
      return result.data;
    } catch (e) {
      const error = e as AxiosError;
      if (error.request) {
        return error.request;
      } else {
        return error.response?.data;
      }
    }
  }
);

export const createOneUser = createAsyncThunk(
  "createOneUser",
  async ({ email, password, name, avatar, age }: NewUser) => {
    try {
      const result = await axios.post<NewUser>(`${baseApi}/users`, {
        email: email,
        password: password,
        name: name,
        avatar: avatar,
        age: age,
      });
      return result.data;
    } catch (e) {
      const error = e as AxiosError;
      return error;
    }
  }
);

export const updateUserInfo = createAsyncThunk(
  "updateUserInfo",
  async ({ id, name, age, avatar }: {
    id: string; name: string; age: number; avatar: string;
  }) => {
    console.log("UserInfo", name, age)
    try {
      await axios.patch<User>(
        `${baseApi}/users/${id}`,
        {
          name: name,
          age: age,
          avatar: avatar,
        },
        { headers: { Authorization: `Bearer ${resultToken}` } }
      );
      const result = await axios.get<User>(
        `${baseApi}/users/profile`, { headers: { Authorization: `Bearer ${resultToken}` } }
      );
      return result.data;
    } catch (e) {
      const error = e as AxiosError;
      return error;
    }
  }
);

export const changeUserPassword = createAsyncThunk(
  "changeUserPassword",
  async ({ id, password }: { id: string; password: string }) => {
    try {
      const result = await axios.patch<User>(
        `${baseApi}/users/password/${id}`,
        { password: password },
        { headers: { Authorization: `Bearer ${resultToken}` } }
      );
      return result.data;
    } catch (e) {
      const error = e as AxiosError;
      return error;
    }
  }
);

export const getCurrentUserProfile = createAsyncThunk(
  "getCurrentUserProfile",
  async () => {
    try {
      const result = await axios.get<User>(
        `${baseApi}/users/profile`, { headers: { Authorization: `Bearer ${resultToken}` } }
      );
      return result.data;
    } catch (e) {
      const error = e as AxiosError;
      return error
    }
  }
)

export const deleteUser = createAsyncThunk(
  "deleteUser",
  async (userId: string) => {
    try {
      const ProfileToken = localStorage.getItem('loginResponse')
      const resultToken = ProfileToken && JSON.parse(ProfileToken)
      await axios.delete<User>(`${baseApi}/users/${userId}`,{ headers: { Authorization: `Bearer ${resultToken}` } } );
      // return result.data
      return userId;
    } catch (e) {
      const error = e as AxiosError;
      return error.message;
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    createUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
  },
  extraReducers: (build) => {
    build
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        if (action.payload instanceof AxiosError) {
          state.error = action.payload.message;
        } else {
          const updatedUsersListToIncludeId = action.payload.users.map((user: User) => {
            user.id = user.email
            return user
          })
          state.users = updatedUsersListToIncludeId || [];
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
          state.error = action.payload.message;
        } else {
          state.newUser = action.payload;
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
          state.error = action.payload.message;
        } else {
          state.currentUser = action.payload;
          state.loading = false;
        }
      })
      .addCase(fetchLoggedInUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLoggedInUserProfile.rejected, (state) => {
        state.error =
          "Profile page is not available to the moment, please try again later.";
      })
      .addCase(updateUserInfo.rejected, (state) => {
        state.error = "User information update failed. Please try again later.";
        state.loading = false;
      })
      .addCase(updateUserInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        if (action.payload instanceof AxiosError) {
          state.error = action.payload.message;
        } else {
          console.log('res =', action.payload)
          state.currentUser = action.payload;
          state.loading = false;
        }
      })
      .addCase(changeUserPassword.rejected, (state) => {
        state.error = "Failed to change password. Please try again later.";
        state.loading = false;
      })
      .addCase(changeUserPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(changeUserPassword.fulfilled, (state, action) => {
        if (action.payload instanceof AxiosError) {
          state.error = action.payload.message;
        } else {
          state.currentUser = action.payload;
        }
        state.loading = false;
      })
      .addCase(getCurrentUserProfile.rejected, (state) => {
        state.error = "The User is not available at the moment. Please try again later.";
        state.loading = false;
      })
      .addCase(getCurrentUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUserProfile.fulfilled, (state, action) => {
        if (action.payload instanceof AxiosError) {
          state.error = action.payload.message;
        } else {
          state.currentUser = action.payload;
        }
        state.loading = false;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        const deletedBookId = action.payload as string;
        state.users = state.users.filter((user) => user.id !== deletedBookId);
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.rejected, (state) => {
        state.error =
          "User cannot be deleted at this moment, please try again later.";
      });
  },
});

const userReducer = usersSlice.reducer;

export const { createUser } = usersSlice.actions;

export default userReducer;
