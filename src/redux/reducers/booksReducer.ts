import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Book } from "../../types/Book";
import axios, { AxiosError } from "axios";
import { baseApi } from "../common/baseApi";
import { SingleBook } from "../../types/SingleBook";
import { NewBook } from "../../types/NewBook";
import { UpdateBook } from "../../types/UpdateBook";

interface BookReducer {
  loading: boolean;
  error: string;
  books: Book[];
  newBook: NewBook;
  singleBook: SingleBook;
  genre: string;
  search: string;
  sort: string;
  totalPages: number;
  booksByGenre: Book[];
  updateBook: UpdateBook;
}

export interface FetchQuery {
  page: number;
  pageSize: number;
}

export interface FetchSingleBookQuery {
  id: string | undefined;
}

export interface SearchBookQuery {
  search: string | undefined;
}

export interface SortBookQuery {
  sort: string;
}

export interface FetchQueryCategory {
  genre: string;
}

export interface BooksWithPagination {
  books: Book[];
  totalPages: number;
}

export interface fetchAllBooksQuery {
  genre?: string;
  sort?: string;
  search?: string | undefined;
  page?: number;
  pageSize?: number;
}

const initialState: BookReducer = {
  loading: false,
  error: "",
  books: [],
  genre: "",
  search: "",
  sort: "",
  totalPages: 1,
  booksByGenre: [],
  singleBook: {
    id: "",
    title: "",
    images: [""],
    genre: "",
  },
  updateBook: {
    title: "",
    images: [""],
    genre: "",
  },
  newBook: {
    title: "",
    images: [""],
    genre: "",
  },
};

const ProfileToken = localStorage.getItem("loginResponse");
const resultToken = ProfileToken && JSON.parse(ProfileToken);

export const fetchAllBooks = createAsyncThunk(
  "fetchAllBooks",
  async ({ page, pageSize, genre, search, sort }: fetchAllBooksQuery) => {
    try {
      console.log("Search terms: ", search);
      let endpoint = `${baseApi}/books?page=${page}&pageSize=${pageSize}`;
      if (genre && genre !== "All") {
        console.log("Genre: ", genre);
        endpoint += `&genre=${genre}`;
      }
      if (search && search !== "") {
        endpoint += `&search=${search}`;
      }
      if (sort && sort !== "None") {
        endpoint += `&sortOrder=${sort}`;
      }

      const result = await axios.get<{ books: Book[] }>(endpoint);
      localStorage.setItem('allBooks', JSON.stringify(result.data.books));
      return result.data;
    } catch (e) {
      const error = e as AxiosError;
      return error.message;
    }
  }
);

export const fetchBooksByGenre = createAsyncThunk(
  "fetchBooksByGenre",
  async ({ genre }: FetchQueryCategory) => {
    try {
      const result = await axios.get<Book[]>(
        `${baseApi}/Books/categorize?genre=${genre}`
      );
      return result.data;
    } catch (e) {
      const error = e as AxiosError;
      return error.message;
    }
  }
);

export const SearchBooksByTitle = createAsyncThunk(
  "SearchBooksByTitle",
  async ({ search }: SearchBookQuery) => {
    try {
      const result = await axios.get<Book[]>(
        `${baseApi}/Books/search?searchTerm=${search}`
      );
      return result.data;
    } catch (e) {
      const error = e as AxiosError;
      return error.message;
    }
  }
);

export const SortBooks = createAsyncThunk(
  "SortBooks",
  async ({ sort }: SortBookQuery) => {
    try {
      const result = await axios.get<Book[]>(
        `${baseApi}/Books/sort?sortOrder=${sort}`
      );
      return result.data;
    } catch (e) {
      const error = e as AxiosError;
      return error.message;
    }
  }
);

export const fetchSingleBook = createAsyncThunk(
  "fetchSingleBook",
  async ({ id }: FetchSingleBookQuery) => {
    try {
      const result = await axios.get<SingleBook>(`${baseApi}/books/${id}`);
      console.log("SingleBook: ", result);
      return result.data;
    } catch (e) {
      const error = e as AxiosError;
      return error.message;
    }
  }
);

export const createOneBook = createAsyncThunk(
  "createOneBook",
  async ({ title, genre, images }: NewBook) => {
    try {
      const ProfileToken = localStorage.getItem("loginResponse");
      const resultToken = ProfileToken && JSON.parse(ProfileToken);
      const result = await axios.post<NewBook>(
        `${baseApi}/Books`,
        { title: title, genre: genre, images: images },
        { headers: { Authorization: `Bearer ${resultToken}` } }
      );
      return result.data;
    } catch (e) {
      const error = e as AxiosError;
      return error;
    }
  }
);

export const updateOneBook = createAsyncThunk(
  "updateOneBook",
  async ({ id, title, genre, images }: Book) => {
    try {
      const ProfileToken = localStorage.getItem("loginResponse");
      const resultToken = ProfileToken && JSON.parse(ProfileToken);
      const result = await axios.patch<Book>(
        `${baseApi}/Books/${id}`,
        { title: title, genre: genre, images: images },
        { headers: { Authorization: `Bearer ${resultToken}` } }
      );
      return result.data;
    } catch (e) {
      const error = e as AxiosError;
      return error.message;
    }
  }
);

export const deleteBook = createAsyncThunk(
  "deleteBook",
  // async ({ id }: Book) => {
  async (bookId: string) => {
    try {
      const ProfileToken = localStorage.getItem('loginResponse')
      const resultToken = ProfileToken && JSON.parse(ProfileToken)
      await axios.delete<Book>(`${baseApi}/Books/${bookId}`,{ headers: { Authorization: `Bearer ${resultToken}` } } );
      // return result.data
      return bookId;
    } catch (e) {
      const error = e as AxiosError;
      return error.message;
    }
  }
);

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    cleanUpBookReducer: () => {
      return initialState;
    },
    setGenre: (state, action) => {
      state.genre = action.payload;
    },
    selectGenre: (state, action) => {
      state.genre = action.payload;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(fetchAllBooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllBooks.rejected, (state) => {
        state.loading = false;
        state.error =
          "This action cannot be completed at the moment, please try again later";
      })
      .addCase(fetchAllBooks.fulfilled, (state, action) => {
        if (typeof action.payload === "string") {
          state.loading = false;
          state.error = action.payload;
        } else {
          const booksPayload = action.payload as BooksWithPagination;
          state.loading = false;
          state.error = "";
          state.books = booksPayload.books;
          state.totalPages = booksPayload.totalPages;
        }
      })
      .addCase(fetchSingleBook.fulfilled, (state, action) => {
        if (typeof action.payload === "string") {
          state.error = action.payload;
        } else {
          state.singleBook = action.payload;
        }
        state.loading = false;
      })
      .addCase(fetchSingleBook.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleBook.rejected, (state) => {
        state.loading = false;
        state.error =
          "This action cannot be completed at the moment, please try again later";
      })
      .addCase(fetchBooksByGenre.fulfilled, (state, action) => {
        if (typeof action.payload === "string") {
          state.error = action.payload;
        } else {
          state.books = action.payload;
        }
        state.loading = false;
      })
      .addCase(fetchBooksByGenre.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBooksByGenre.rejected, (state) => {
        state.loading = false;
        state.error =
          "This action cannot be completed at the moment, please try again later";
      })
      .addCase(SearchBooksByTitle.fulfilled, (state, action) => {
        if (typeof action.payload === "string") {
          state.error = action.payload;
        } else {
          state.books = action.payload;
        }
        state.loading = false;
      })
      .addCase(SearchBooksByTitle.pending, (state) => {
        state.loading = true;
      })
      .addCase(SearchBooksByTitle.rejected, (state) => {
        state.loading = false;
        state.error =
          "This action cannot be completed at the moment, please try again later";
      })
      .addCase(SortBooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(SortBooks.rejected, (state) => {
        state.loading = false;
        state.error =
          "This action cannot be completed at the moment, please try again later";
      })
      .addCase(SortBooks.fulfilled, (state, action) => {
        if (typeof action.payload === "string") {
          state.loading = false;
          state.error = action.payload;
        } else {
          state.books = action.payload;
        }
        state.loading = false;
      })
      .addCase(createOneBook.fulfilled, (state, action) => {
        if (action.payload instanceof AxiosError) {
          state.error = action.payload.message;
        } else {
          state.newBook = action.payload;
        }
      })
      .addCase(createOneBook.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOneBook.rejected, (state) => {
        state.error =
          "Your book cannot be created at the moment, please try again later.";
      })
      .addCase(updateOneBook.fulfilled, (state, action) => {
        if (action.payload instanceof AxiosError) {
          state.error = action.payload.message;
        } else {
          // state.books = action.payload
          const updatedBook = action.payload as Book;
        }
        const updatedBook = action.payload as Book;
        const index = state.books.findIndex(
          (book) => book.id === updatedBook.id
        );
        if (index !== -1) {
          state.books[index] = updatedBook;
        }
      })
      .addCase(updateOneBook.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOneBook.rejected, (state) => {
        state.error =
          "Your book cannot be updated at this moment, please try again later.";
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        const deletedBookId = action.payload as string;
        state.books = state.books.filter((book) => book.id !== deletedBookId);
      })
      .addCase(deleteBook.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBook.rejected, (state) => {
        state.error =
          "Your book cannot be deleted at this moment, please try again later.";
      });
  },
});

const booksReducer = booksSlice.reducer;
export const { cleanUpBookReducer, setGenre, selectGenre } = booksSlice.actions;
export default booksReducer;
