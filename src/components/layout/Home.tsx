import { useEffect, useState } from 'react';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { FetchQuery, SortBooks, fetchAllBooks, fetchAllBooksQuery, fetchBooksByGenre } from '../../redux/reducers/booksReducer';
import BookCard from './BookCard';
import Header from './Header'
import { Container, Pagination, Stack } from '@mui/material';
import SelectGenre from './SelectGenre';
import { Book } from '../../types/Book';
import SortBooksInAscOrDesc from './SortBooksInAscOrDesc';
import { useDebounce } from 'use-debounce';
import Grid from '@mui/material/Grid';
// import Paper from '@mui/material/Paper';

const Home = () => {
  const dispatch = useAppDispatch();
  const { books, loading, totalPages } = useAppSelector((state) => state.booksReducer);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize] = useState(8);
  const [genreState, setGenreState] = useState("All");
  const [sortingOrder, setSortingOrder] = useState("None")
  const [cartItemCount, setCartItemCount] = useState(0);
  const [searchString, setSearchString] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchString, 300)
  const [spacing] = useState(2);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
  setPageNo(value);
  dispatch(fetchAllBooks({
      page: value,
      pageSize: pageSize,
      genre: genreState,
      sort: sortingOrder,
      search: debouncedSearchTerm
    }
  ));
};

useEffect(() => {
  dispatch(fetchAllBooks({
      page: pageNo,
      pageSize: pageSize,
      genre: genreState,
      sort: sortingOrder,
      search: debouncedSearchTerm
    }
  ));
}, [sortingOrder, genreState, debouncedSearchTerm]);

const getGenreProps = (genre: string) => {
  setGenreState(genre);
  setPageNo(1)
};

const handleSortChange = (newSortingOrder: string) => {
  setSortingOrder(newSortingOrder);
};

const handleSearch = (searchString: string) => {
  setSearchString(searchString);
};

return (
  <>
    <Header handleSearch={handleSearch} />
    
    <Container maxWidth="md">
    <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap" style={{ marginTop: '5rem' }}>
    <SelectGenre getGenre={getGenreProps} />
    <SortBooksInAscOrDesc handleSortChange={handleSortChange} />
  </Stack>
  
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Grid sx={{ flexGrow: 1 }} container spacing={2}>
          <Grid item xs={12}>
            <Grid container justifyContent="center" spacing={spacing}>
              {books.map((book) => (
                <Grid key={book.title} item>
                  <BookCard book={book} setCartItemCount={setCartItemCount} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      )}
      <Pagination count={totalPages} page={pageNo} onChange={handleChange} style={{marginTop: '1rem'}} color="primary"  />
    </Container>
  </>
  )
}

export default Home