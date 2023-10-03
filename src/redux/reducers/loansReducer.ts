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
  loanId?: string;
  bookTitle?: string;
}

const ProfileToken = localStorage.getItem("loginResponse");
const resultToken = ProfileToken && JSON.parse(ProfileToken);

const userloans = localStorage.getItem('userLoans');
const loans = userloans && JSON.parse(userloans);

let returnLoanId: string|undefined;

export const fetchAllUsersLoan = createAsyncThunk(
  "fetchAllUsersLoan",
  async ({ userId }: fetchAllUsersLoanQuery) => {
    try {
      console.log('userId =', userId)
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

export const returnASingleLoan = createAsyncThunk(
  "returnASingleLoan",
  async ({loanId}: fetchAllUsersLoanQuery) => {
    try {
      returnLoanId = loanId
      const result = await axios.put<{ loanId: any }>(
        `${baseApi}/Loans/return/${loanId}`, null,
        { headers: { Authorization: `Bearer ${resultToken}` } }
      )
      return result.data.loanId
    } catch (e) {
      const error = e as AxiosError
      return error.message
    }
  }
)

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
            state.loading = false
        }
      })
      .addCase(returnASingleLoan.pending, (state) => {
        state.loading = true;
      })
      .addCase(returnASingleLoan.rejected, (state) => {
        state.loading = false
        state.error = "This action cannot be completed at the moment, please try again later";
      })
      .addCase(returnASingleLoan.fulfilled, (state, action) => {
        if (action.payload instanceof AxiosError) {
          state.error = action.payload.message;
        } else {    
          const updatedLoan = action.payload;
          console.log("updatedLoan", updatedLoan)
          // const updatedLoanId = updatedLoan; 
            console.log("loans", loans)
          const loanIndex = loans.findIndex((loan: Loan) => loan.id === updatedLoan);
          console.log("loanIndex", loanIndex)
      
          if (loanIndex !== -1) {
            // // state.loans[loanIndex] = updatedLoan.loans[0];
            // console.log("loans.splice", loans.splice(loanIndex, 1))
            // state.loans = loans.splice(loanIndex, 1)
            // localStorage.setItem('userLoans', JSON.stringify(loans.splice(loanIndex, 1)));
            const updatedLoans = [...loans]; // Create a shallow copy of the original array
            updatedLoans.splice(loanIndex, 1); // Remove the old loan from the copied array
            // updatedLoans.push(updatedLoan); // Add the updated loan to the copied array
            console.log("updatedLoans", updatedLoans)
      
            state.loans = updatedLoans; // Update the state with the new array
            localStorage.setItem('userLoans', JSON.stringify(updatedLoans));
            state.loading = false
          }
        }
      })
      ;
  },
});

const loansReducer = loansSlice.reducer;
export const { cleanUpBookReducer } = loansSlice.actions;
export default loansReducer;
