import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import { fetchSingleBook } from "../../redux/reducers/booksReducer";
import Header from "./Header";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  useTheme,
} from "@mui/material";

const BookDetails = () => {
  const theme = useTheme();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { singleBook } = useAppSelector((state) => state.booksReducer);
  const [searchString, setSearchString] = useState("");

  useEffect(() => {
    dispatch(fetchSingleBook({ id }));
  }, [id]);

  const handleSearch = (searchString: string) => {
    setSearchString(searchString);
  };

  return (
    <>
      <Header handleSearch={handleSearch} />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 5rem)",
        }}
      >
        <Card
          sx={{ display: "flex", justifyContent: "center", maxWidth: "100%" }}
          // style={{ marginTop: "5rem" }}
        >
          <CardMedia
            component="img"
            sx={{ width: 151 }}
            image={
              singleBook.images && singleBook.images.length > 0
                ? singleBook.images[0]
                : "https://islandpress.org/sites/default/files/default_book_cover_2015.jpg"
            }
          />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flex: "1 0 auto" }}>
              <Typography component="div" variant="h5">
                {singleBook?.title}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
              >
                {singleBook?.genre}
              </Typography>
            </CardContent>
          </Box>
        </Card>
      </div>
    </>
  );
};

export default BookDetails;
