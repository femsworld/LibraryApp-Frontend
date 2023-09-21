import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import useAppDispatch from '../../../hooks/useAppDispatch';
import { createOneBook } from '../../../redux/reducers/booksReducer';
import { useState } from 'react';

export default function CreateBook() {
  const [open, setOpen] = React.useState(false);
  const dispatch = useAppDispatch();

  const [genre, setGenre] = useState("");
  const [title, setTitle] = useState("")
  const [images, setImages] = useState([])

  const selectLabels = (event: SelectChangeEvent) => {
    setGenre(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addNewBook = () => {
    dispatch(createOneBook({title, genre, images }))
    handleClose()
  }

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Create Book
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add new book</DialogTitle>
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
            onChange={(e) => setTitle(e.target.value)}
          />
          <FormControl sx={{ m: 1, minWidth: 120 }}>
        <Select
          value={genre}
          onChange={selectLabels}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
          >
          <MenuItem value={"TextBooks"}>TextBooks</MenuItem>
          <MenuItem value={"Novel"}>Novel</MenuItem>
          <MenuItem value={"Fiction"}>Fiction</MenuItem>
          <MenuItem value={"ResearchPaper"}>ResearchPaper</MenuItem>
        </Select>
      </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={addNewBook}>Add Book</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
