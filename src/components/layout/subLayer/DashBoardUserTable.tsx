import React, { useState, useEffect } from "react";
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid";
import useAppSelector from "../../../hooks/useAppSelector";
import useAppDispatch from "../../../hooks/useAppDispatch";
import {
  deleteUser,
  fetchAllUsers,
  FetchQuery,
} from "../../../redux/reducers/usersReducer";
import {
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EditBook from "./EditBook";

export default function DashBoardUserTable() {
  const dispatch = useAppDispatch();
  const { users, loading } = useAppSelector((state) => state.userReducer);
  const [paginationQuery, setPaginationQuery] = useState<FetchQuery>({
    page: 0,
    per_page: 5,
  });
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{
    // id: string;
    email: string;
  } | null>(null);

  const handleDeleteUser = async (userId: string) => {
    if (userId) {
      await dispatch(deleteUser(userId));
      setSelectedUserId(null);
    }
  };
  // const handleEditBook = (userId: string) => {
  //   console.log(`Editing user with ID: ${userId}`);
  // };

  const openDeleteDialog = (user: { email: string }) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const buttonStyle = {
    width: "75px",
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 200 },
    { field: "email", headerName: "Email", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params: GridCellParams) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* <EditBook id={params.row.id} /> */}
          <span style={{ marginRight: "15px" }}></span>
          <Button
            variant="outlined"
            color="primary"
            onClick={() =>
              openDeleteDialog({
                email: params.row.email as string,
              })
            }
            style={buttonStyle}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [paginationQuery]);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <>{console.log('users =', users)}</>
      <Container maxWidth="md">
        <DataGrid
          rows={users}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
        />
      </Container>
      <Dialog open={isDeleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          {userToDelete && (
            <p>
              Are you sure you want to delete this user: {userToDelete.email}?
            </p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (userToDelete) {
                handleDeleteUser(userToDelete.email);
              }
              closeDeleteDialog();
            }}
            color="primary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
