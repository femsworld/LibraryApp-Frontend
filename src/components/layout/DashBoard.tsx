import DashBoardBookTable from "./subLayer/DashBoardBookTable";
import CreateBook from "./subLayer/CreateBook";
import { Container } from "@mui/material";
import Header from "./Header";
import { useState } from "react";
import EditBook from "./subLayer/EditBook";

const DashBoard = () => {
  const [searchString, setSearchString] = useState('');

  const handleSearch = (searchString: string) => {
    setSearchString(searchString);
  };

  return (
    <div>
      <Header handleSearch={handleSearch} />
      <Container maxWidth="md" style={{ marginTop: '5rem' }}>
        <div style={{ marginBottom: '0.5rem' }}>
        <CreateBook />
        </div>
        <DashBoardBookTable />
      </Container>
    </div>
  );
};

export default DashBoard;
