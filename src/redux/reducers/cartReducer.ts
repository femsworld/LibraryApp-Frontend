import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CartItem } from "../../types/CartItem";
import { baseApi } from "../common/baseApi";
import axios, { AxiosError } from "axios";
import { LoanBook } from "../../types/LoanBook";
import { Loan } from "../../types/Loan";

interface CartReducer {
  items: CartItem[];
  count: number;
  loading: boolean;
  error: string;
}

const initialState: CartReducer = {
  items: [],
  count: 0,
  loading: false,
  error: "",
};

export const mapLoanToCartItem = (loan: Loan): CartItem[] => {
  const cartItems: CartItem[] = loan.loanBooks.map((loanBook: LoanBook) => {
    return {
      id: loanBook.bookId, 
      title: "", 
      images: [], 
      quantity: 1,
    };
  });

  return cartItems;
};

export const placeLoan = createAsyncThunk(
  "placeLoan" , 
  async({ loanBooks }: { loanBooks: LoanBook[] }) => {
  try {
    const storeToken = localStorage.getItem("loginResponse");
    const parseStoreToken = storeToken && JSON.parse(storeToken);
    
    const result = await axios.post<Loan>(`${baseApi}/Loans`,  { loanBooks  }, { headers: { Authorization: `Bearer ${parseStoreToken}` } })
    return result.data
  } catch (e) {
    const error = e as AxiosError
    return error
  }
  }
)

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action) => {
      const newItem: CartItem = action.payload;
      const inCart = localStorage.getItem('cartItems')
      const cartItems = inCart && JSON.parse(inCart)

      if(cartItems){
        cartItems.map((item: {id: string, quantity: number}) => {
          if(item.id === newItem.id){
            item.quantity += 1
          }
        });
        const existingItem = cartItems.find((item: {id: string}) => item.id === newItem.id);
        if (!existingItem) {
          const newCartItem = { ...newItem, quantity: 1 };
          cartItems.push(newCartItem);
        }
        
        localStorage.setItem('cartItems', JSON.stringify(cartItems))
        
        const updatedCart = localStorage.getItem('cartItems')
        const updatedCartItems = updatedCart && JSON.parse(updatedCart)
        state.items = [...updatedCartItems]
      } else {
        const newCartItem = { ...newItem, quantity: 1 };
        const newCart = [newCartItem]
        localStorage.setItem('cartItems', JSON.stringify(newCart))

        const updatedCart = localStorage.getItem('cartItems')
        const updatedCartItems = updatedCart && JSON.parse(updatedCart)
        state.items = [...updatedCartItems]
      }
    },
    decreaseItemInCart: (state, action) => {
      const newItem: CartItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      if (existingItem) {
        if (existingItem.quantity){
          existingItem.quantity-= 1;
        } 
      } else {
        const newCartItem = { ...newItem, quantity: 1 };
        state.items.push(newCartItem);
      }
    },
    removeItemFromCart: (state, action) => {
      const itemObj = action.payload;
      const updatedCart = localStorage.getItem('cartItems')
      const updatedCartItems = updatedCart && JSON.parse(updatedCart)
    const existingItemIndex = updatedCartItems.findIndex((item: {id: string}) => item.id === itemObj.id);
      if (existingItemIndex !== -1) {
        updatedCartItems.splice(existingItemIndex, 1);
        state.items = [...updatedCartItems]
        localStorage.setItem('cartItems', JSON.stringify(state.items))
      }
    },
    clearCart: (state) => {
      return initialState;
    },
  },
  extraReducers: (build) => {
    build
    .addCase(placeLoan.fulfilled, (state, action) => {
      if (action.payload instanceof AxiosError) {
        state.error = action.payload.message;
      } else {
        state.loading = false;
        const cartItems = mapLoanToCartItem(action.payload);
        state.items = cartItems;
      }
    })
      .addCase(placeLoan.pending, (state) => {
        state.loading = true;
      })
      .addCase(placeLoan.rejected, (state) => {
        state.error = "Cannot fetch data";
      })
  },
});

export const { addItemToCart, decreaseItemInCart, removeItemFromCart, clearCart } = cartSlice.actions;

const cartReducer = cartSlice.reducer;
export default cartReducer;
