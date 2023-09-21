import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { fetchAllBooks, fetchAllBooksQuery } from '../../redux/reducers/booksReducer';
import { useState } from 'react';
import useAppDispatch from '../../hooks/useAppDispatch';

interface GetGenreProps {
    getGenre(genre: string): void;
  }

const SelectGenre: React.FC<GetGenreProps> = ({getGenre}) => {
  const [genre, setGenre] = React.useState('All');
  const dispatch = useAppDispatch();

  const selectLabels = (event: SelectChangeEvent) => {
    const selectedGenre = event.target.value;
    setGenre(selectedGenre);
    getGenre(selectedGenre);
  };

  return (
      <FormControl sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="demo-simple-select-label">Select Genre</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={genre}
          label="Select Genre"
          onChange={selectLabels}
          // displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem value="">
          </MenuItem>
          <MenuItem value={"All"}>All</MenuItem>
          <MenuItem value={"TextBooks"}>TextBooks</MenuItem>
          <MenuItem value={"Novel"}>Novel</MenuItem>
          <MenuItem value={"Fiction"}>Fiction</MenuItem>
          <MenuItem value={"ResearchPaper"}>ResearchPaper</MenuItem>
        </Select>
      </FormControl>
  );
}

export default SelectGenre