import React, { useEffect, useState } from 'react';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { fetchLoggedInUserProfile } from '../../redux/reducers/usersReducer';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Header from './Header';
import { fetchAllUsersLoan, returnASingleLoan } from '../../redux/reducers/loansReducer';
import { LoanBook } from '../../types/LoanBook';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { Loan } from '../../types/Loan';
import { fetchAllBooks, fetchAllBooksQuery } from '../../redux/reducers/booksReducer';
import { Container } from '@mui/system';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

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

function Row(props: { row: ReturnType<typeof createData>, openDialog: (loan: { id: string }) => void, closeDialog: () => void }) {
  const { row, openDialog, closeDialog } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.id}
        </TableCell>
        <TableCell>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              openDialog({ id: row.id }); 
            }}
          >
            Return Loan
          </Button>
        </TableCell>
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

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const [paginationQuery, setPaginationQuery] = useState<fetchAllBooksQuery>({
    page: 0,
    pageSize: 5,
  });
  // const { currentUser, loading, error } = useAppSelector((state) => state.userReducer);
  const { loading, error } = useAppSelector((state) => state.userReducer);
  // const loans = useAppSelector((state) => state.loansReducer.loans);
  const [searchString, setSearchString] = useState("");
  const [selectedLoankId, setSelectedLoanId] = useState<string | null>(null);
  const [isReturnDialogOpen, setReturnDialogOpen] = useState(false);
  const [loanToReturn, setLoanToReturn] = useState<{ id: string } | null>(null);
  const [loanDetailsLoading, setLoanDetailsLoading] = useState(true);
  
  const userProfile = localStorage.getItem('userProfile');
  const currentUser = userProfile && JSON.parse(userProfile);


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

  const handleSearch = (searchString: string) => {
    setSearchString(searchString);
  };

  const handleReturnLoan = async (loanId: string) => {
    if (loanId) {
      await dispatch(returnASingleLoan({ loanId: loanId }));
      setSelectedLoanId(null);
    }
  };

  const handleReturnDialogOpen  = (loan: { id: string }) => {
    setLoanToReturn(loan);
    console.log("OpenDialog")
    setReturnDialogOpen(true);
  };

  const handleReturnDialogClose  = () => {
    setReturnDialogOpen(false);
    setLoanToReturn(null);
  };

  useEffect(() => {
    // dispatch(fetchLoggedInUserProfile());
    dispatch(fetchAllBooks(paginationQuery));
    dispatch(fetchAllUsersLoan({ userId: currentUser?.id }))

    setTimeout(() => {
      console.log(loanDetailsLoading)
      if(Array.isArray(rows)){
        setLoanDetailsLoading(false)
      }
    }, 1000);
	// return () => {
  //     handleReturnDialogClose();
  //   };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Header handleSearch={handleSearch} />
      {/* {!Array.isArray(rows) && <h1 style={{ marginTop: "5rem" }}>Loading...</h1>} */}
      <Container style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '800px', marginTop: "5rem" }}>
        <Card style={{ margin: '0 1rem' }}>
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
                <img src={currentUser?.avatar} alt="Avatar" style={{ maxWidth: '100%', height: 'auto' }} />
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                  <Button 
                    size="small"
                    variant="outlined" 
                    color="primary" 
                    style={{ alignItems: 'center' }}>
                    Update
                  </Button>
                  <span style={{ marginRight: "5px" }}></span>
                  <Button 
                    size="small"
                    variant="outlined" 
                    color="primary" 
                    style={{ alignItems: 'center' }}>
                    Change Password
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <TableContainer component={Paper} >
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Loan ID</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
				{/* {rows && rows.map((row: { id: string, details: any }) => (
				  <Row
					key={row.id}
					row={row}
					openDialog={handleReturnDialogOpen}
					closeDialog={handleReturnDialogClose}
				  />
				))} */}
        {loanDetailsLoading ? <h1>Loading...</h1>
        :(rows.map((row: { id: string, details: any }) => (
          <Row
            key={row.id}
            row={row}
            openDialog={(loan: { id: string }) => handleReturnDialogOpen(loan)}
            closeDialog={handleReturnDialogClose}
          />
        )))}
        {/* {!loanDetailsLoading && rows.map((row: { id: string, details: any }) => (
        <Row
          key={row.id}
          row={row}
          openDialog={(loan: { id: string }) => handleReturnDialogOpen(loan)}
          closeDialog={handleReturnDialogClose}
        />
      ))} */}

            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <Dialog open={isReturnDialogOpen} onClose={handleReturnDialogClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          {loanToReturn && (
            <p>Are you sure you want to delete this book: {loanToReturn.id}?</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReturnDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (loanToReturn) {
                handleReturnLoan(loanToReturn.id);
              }
              handleReturnDialogClose();
            }}
            color="primary"
          >
            Return Loan
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProfilePage;

