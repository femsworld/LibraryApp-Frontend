import React, { useEffect, useState } from 'react';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { fetchLoggedInUserProfile } from '../../redux/reducers/usersReducer';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Header from './Header';
import { fetchAllUsersLoan } from '../../redux/reducers/loansReducer';
import { LoanBook } from '../../types/LoanBook';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Loan } from '../../types/Loan';
import { fetchAllBooks, fetchAllBooksQuery } from '../../redux/reducers/booksReducer';

const userloans = localStorage.getItem('userLoans');
const loans = userloans && JSON.parse(userloans);
const allBooks = localStorage.getItem('allBooks');
const books = allBooks && JSON.parse(allBooks);

function createData(id: string, loanBooks: [{bookId: string, title: string}]) {
  return {
    id,
    details: loanBooks
  }
}

function Row(props: { row: ReturnType<typeof createData> }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
      {/* <TableRow key={row.loanId}> */}
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {/* <TableCell>{row.loanId}</TableCell> */}
        <TableCell component="th" scope="row">
          {row.id}
        </TableCell>
        {/* <TableCell align="right">{row.id}</TableCell> */}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Details              
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Index</TableCell>
                    <TableCell>Book ID</TableCell>
                    <TableCell>Book Title</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.details.map((detailsRow: {bookId: string, title: string}, index: number) => (
                    <TableRow key={detailsRow.bookId}>
                      <TableCell component="th" scope="row">
                        {index+1}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {detailsRow.bookId}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {detailsRow.title}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

const rows = loans && books && loans.map((loan: {id: string, loanBooks: [{bookId: string, title: string}]}) => {
  const loanBooks = loan.loanBooks
  for (const loan of loanBooks) {
    for (const book of books) {
      if(loan.bookId === book.id){
        loan.title = book.title
      }
    }
  }

  return createData(loan.id, loanBooks)
});

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  
  const [paginationQuery, setPaginationQuery] = useState<fetchAllBooksQuery>({
    page: 0,
    pageSize: 5,
  });
  const { currentUser, loading, error } = useAppSelector((state) => state.userReducer);
  const loans = useAppSelector((state) => state.loansReducer.loans);
  const [searchString, setSearchString] = useState("");

  const handleSearch = (searchString: string) => {
    setSearchString(searchString);
  };

  useEffect(() => {
    dispatch(fetchLoggedInUserProfile());
    dispatch(fetchAllBooks(paginationQuery));
    dispatch(fetchAllUsersLoan({ userId: currentUser?.id }))
  }, []);

  return (
    <div>
      <Header handleSearch={handleSearch} />
      <Card style={{ maxWidth: '400px', marginTop: "5rem" }}>
        <CardContent>
          <Typography variant="h5" component="div">
            ProfilePage
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          ) : (
            <div>
              <Typography variant="h6" gutterBottom>
                Name: {currentUser?.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Email: {currentUser?.email}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Age: {currentUser?.age}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Role: {currentUser?.role}
              </Typography>
              <img src={currentUser?.avatar} alt="Avatar" />
            </div>
          )}
        </CardContent>
      </Card>
      {/* Display the loans in a table */}
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Loan ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows && rows.map((row: {id: string, details: any}) => (
              <Row key={row.id} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ProfilePage;
