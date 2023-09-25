import React from "react";
import { useDispatch } from "react-redux";
import { Book } from "../../types/Book";
import useAppSelector from "../../hooks/useAppSelector";
import { addItemToCart } from "../../redux/reducers/cartReducer";
import { Button, IconButton } from "@mui/material";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Link } from "react-router-dom";

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface BookCardProps {
  book: Book;
  setCartItemCount: React.Dispatch<React.SetStateAction<number>>;
}

const BookCard: React.FC<BookCardProps> = ({ book, setCartItemCount }) => {
  const dispatch = useDispatch();
  const { items } = useAppSelector((state) => state.cartReducer);
  const addOneItemToCart = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    dispatch(addItemToCart(book));
    setCartItemCount(prevCount => prevCount + 1);
  };

  const cardStyle = {
    width: 190,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: 'center', // Center content vertically
    // alignItems: 'center', // Center content horizontally
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.2)',
    },
  };

  const detailsButtonStyle = {
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)", // Center the button horizontally
  };

  return (
    <Box sx={cardStyle}>
      <Card sx={{ height: '100%' }}>
        <CardMedia
          sx={{ height: 140 }}
          image={
            book.images && book.images.length > 0
              ? book.images[0]
              : "https://islandpress.org/sites/default/files/default_book_cover_2015.jpg"
          }
          title={book.title}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="div">
            {book.title.length > 12 ? `${book.title.substring(0, 12)}...` : book.title}
          </Typography>
        </CardContent>
        <CardActions>
          <IconButton onClick={(e) => addOneItemToCart(e)} size="large" aria-label="shopping cart" color="primary">
            <AddShoppingCartIcon />
          </IconButton>
          <Link to={`/bookDetails/${book.id}`}>
            <Button variant="outlined">Details</Button>
          </Link>
        </CardActions>
      </Card>
    </Box>
  );
}

export default BookCard;
