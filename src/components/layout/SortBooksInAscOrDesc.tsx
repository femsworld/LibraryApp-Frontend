import React, { useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import useAppDispatch from '../../hooks/useAppDispatch';
import { SortBooks, fetchAllBooks, fetchAllBooksQuery } from '../../redux/reducers/booksReducer';


export interface SortBooksInAscOrDescProps {
  handleSortChange: (newSortAsc: string) => void;
}

    const SortBooksInAscOrDesc: React.FC<SortBooksInAscOrDescProps> = ({ handleSortChange }) => {
    const [sortOrder, setSortOrder] = useState('None');
    const dispatch = useAppDispatch();
    const [ paginationQuery, setPaginationQuery] = useState<fetchAllBooksQuery>({
      page: 1, pageSize: 6, sort: "",
    })

      const handleSortOrderChange = (event: SelectChangeEvent<string>) => {
        const newSortOrder = event.target.value as string;
        setSortOrder(newSortOrder);
        handleSortChange(newSortOrder);
      };
      
    return (
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-label">Sort Order</InputLabel>
        <Select 
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={sortOrder}
          label="Sort Order" 
          onChange={handleSortOrderChange}>
          <MenuItem value="None">None</MenuItem>
          <MenuItem value="Ascending">Ascending</MenuItem>
          <MenuItem value="Descending">Descending</MenuItem>
        </Select>
      </FormControl>
    );
  };
  
  export default SortBooksInAscOrDesc