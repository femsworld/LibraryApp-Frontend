import React, { useEffect, useState } from "react";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import {
  addItemToCart,
  clearCart,
  removeItemFromCart,
  decreaseItemInCart,
  placeLoan,
} from "../../redux/reducers/cartReducer";
import Header from "./Header";
import { CartItem } from "../../types/CartItem";
import {
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const CartPage = () => {
  const dispatch = useAppDispatch();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const cartItemsFromStore = useAppSelector((state) => state.cartReducer.items);
  const [searchString, setSearchString] = useState("");

  const handleClearCart = () => {
    const confirmed = window.confirm(
      "Are you sure you want to empty your cart?"
    );
    if (confirmed) {
      localStorage.removeItem("cartItems");
      setCartItems([]);
    }
  };

  useEffect(() => {
    setCartItems(cartItemsFromStore);
  }, [cartItemsFromStore]);

  const handleIncreaseQuantity = (id: string) => {
    dispatch(addItemToCart({ id }));
  };
  const handleDecreaseQuantity = (id: string) => {
    dispatch(decreaseItemInCart({ id }));
  };
  const handleDeleteQuantity = (id: string) => {
    dispatch(removeItemFromCart({ id }));
  };

  const LoanBooks = async () => {
    const loanBooks = cartItems.map((item) => ({
      bookId: item.id,
    }));

    const booksToLoan = cartItems.map((item) => item.title).join(", ");

    const confirmed = window.confirm(
      `Are you sure you want to loan these books? ${booksToLoan}`
    );

    if (confirmed) {
      await dispatch(placeLoan({ loanBooks }));
      localStorage.removeItem("cartItems");
      setCartItems([]);
    }
  };

  const handleSearch = (searchString: string) => {
    setSearchString(searchString);
  };

  return (
    <div>
      <div>
        <Header handleSearch={handleSearch} />
      </div>
      <Container maxWidth="md" style={{ marginTop: "5rem" }}>
        <Typography variant="h5">Cart Items</Typography>
        {cartItems?.length === 0 ? (
          <Typography variant="body1">Your cart is empty.</Typography>
        ) : (
          <TableContainer component={Paper}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Item</TableCell>
        <TableCell>Quantity</TableCell>
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {cartItems.map((item: CartItem) => (
        <TableRow key={item.id}>
          <TableCell style={{ padding: '8px 16px' }}>
            <Typography variant="subtitle1">{item.title}</Typography>
          </TableCell>
          <TableCell style={{ padding: '8px 16px' }}>
            <Typography variant="subtitle1">Quantity: {item.quantity}</Typography>
          </TableCell>
          <TableCell style={{ padding: '8px 16px' }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleDeleteQuantity(item.id)}
            >
              Remove Item
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
        )}
        <div style={{ marginTop: "1rem" }}>
          <Button variant="outlined" color="primary" onClick={handleClearCart}>
            Clear Cart
          </Button>
          <span style={{ marginRight: "15px" }}></span>
          <Button variant="contained" color="primary" onClick={LoanBooks}>
            Place Loan
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default CartPage;
