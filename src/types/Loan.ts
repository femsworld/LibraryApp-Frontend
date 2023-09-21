import { LoanBook } from "./LoanBook";

export interface Loan {
    userId: string;
    loanBooks: LoanBook[];
    id: string;
    createdAt: string;
    updatedAt: string;
  }