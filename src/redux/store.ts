import { configureStore } from "@reduxjs/toolkit";
import booksReducer from "./reducers/booksReducer";
import userReducer from "./reducers/usersReducer";
import cartReducer from "./reducers/cartReducer";

const store = configureStore({
    reducer: {
        booksReducer,
        userReducer,
        cartReducer,
    },
    preloadedState: {
        booksReducer: {
            loading: false,
            error: "",
            books: [],
            genre: "",
            search: "",
            sort: "",
            totalPages: 1,
            booksByGenre: [],
            newBook: {
                title: "",
                genre: "",
                images: [""]
            },
            singleBook: {
                genre: ""
            },
            updateBook: {
                title: "",
                images: [""],
                genre: ""
              },
        }
    }
})

export type GlobalState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store