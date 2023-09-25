import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { baseApi } from "../common/baseApi";
import { Loan } from "../../types/Loan";

interface LoanReducer {
  loading: boolean;
  error: string;
  loans: Loan[];
}

const initialState: LoanReducer = {
  loading: false,
  error: "",
  loans: [],
};

export interface fetchAllUsersLoanQuery {
  userId?: string;
}

const ProfileToken = localStorage.getItem("loginResponse");
const resultToken = ProfileToken && JSON.parse(ProfileToken);

export const fetchAllUsersLoan = createAsyncThunk(
  "fetchAllUsersLoan",
  async ({ userId }: fetchAllUsersLoanQuery) => {
    try {
      const result = await axios.get<{ loans: Loan[] }>(
        `${baseApi}/Loans/user/${userId}`,
        { headers: { Authorization: `Bearer ${resultToken}` } }
      );
      localStorage.setItem('userLoans', JSON.stringify(result.data));
      return result.data;
    } catch (e) {
      const error = e as AxiosError;
      return error.message;
    }
  }
);

const loansSlice = createSlice({
  name: "loans",
  initialState,
  reducers: {
    cleanUpBookReducer: () => {
      return initialState;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(fetchAllUsersLoan.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsersLoan.rejected, (state) => {
        state.loading = false;
        state.error =
          "This action cannot be completed at the moment, please try again later";
      })
      .addCase(fetchAllUsersLoan.fulfilled, (state, action) => {
        if (action.payload instanceof AxiosError) {
            state.error = action.payload.message 
            state.loans = []
        } else {
            state.loans = (action.payload as { loans: Loan[]; }).loans;
        }
      });
  },
});

const loansReducer = loansSlice.reducer;
export const { cleanUpBookReducer } = loansSlice.actions;
export default loansReducer;
