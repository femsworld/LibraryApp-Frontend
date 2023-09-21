import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import useAppDispatch from "../../../hooks/useAppDispatch";
import { updateOneBook } from "../../../redux/reducers/booksReducer";
import { useEffect, useState } from "react";
import { Genre } from "../../../types/Book";
import useAppSelector from "../../../hooks/useAppSelector";

export default function EditBook({ id }: { id: string }) {

  const [open, setOpen] = React.useState(false);
  const dispatch = useAppDispatch();
  const { books } = useAppSelector((state) => state.booksReducer);

  const [genre, setGenre] = useState<Genre|string>('');
  const [title, setTitle] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const selectLabels = (event: SelectChangeEvent) => {
    setGenre(event.target.value as unknown as Genre);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const existingBook = useAppSelector((state) => {
    const book = state.booksReducer.books.find((book) => book.id === id);

    if (book) {
      return {
        title: book.title,
        genre: book.genre as Genre,
      };
    } else {
      return {
        title: "",
        genre: '',
      };
    }
  });

  const editOneBook = () => {
    console.log('genre =', genre)
    dispatch(updateOneBook({ id, title, genre, images }));
    handleClose();
  };

  useEffect(() => {
    setTitle(existingBook.title);
    setGenre(existingBook.genre);
  }, []);

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Edit
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit book</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter book title and select the genre.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Book Title"
            type="text"
            fullWidth
            variant="standard"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <Select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value={Genre.TextBooks}>TextBooks</MenuItem>
              <MenuItem value={Genre.Novel}>Novel</MenuItem>
              <MenuItem value={Genre.Fiction}>Fiction</MenuItem>
              <MenuItem value={Genre.ResearchPaper}>ResearchPaper</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={editOneBook}>Edit Book</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}



