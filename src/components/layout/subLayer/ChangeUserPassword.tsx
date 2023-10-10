import React, { useState } from 'react'
import useAppDispatch from '../../../hooks/useAppDispatch';
import { User } from '../../../types/User';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { changeUserPassword } from '../../../redux/reducers/usersReducer';

const ChangeUserPassword = () => {
  
  const [open, setOpen] = React.useState(false);
    const dispatch = useAppDispatch();
    const [ password, setPassword ] = useState<User["password"]>("")
    // const [ userId ] = useState<User["id"]>(id)
    // const [ userAge, setUserAge ] = useState<UserProfile["age"]>(age)
    // const [ userAvatar, setUserAvatar ] = useState<UserProfile["avatar"]>(avatar)

    const storedUserProfile = localStorage.getItem("userProfile");
      const user = storedUserProfile && JSON.parse(storedUserProfile)

    const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };

      const updateCurrentUserPassword = () => {
        const userId = user.id
        dispatch(changeUserPassword({ id:userId , password}))
        handleClose()
      }
  return (
    <>
        <Button variant="outlined" onClick={handleClickOpen}>
        Change Password
      </Button>
        <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Enter a new password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your new password.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="password"
            label="password"
            type="text"
            fullWidth
            variant="standard"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={updateCurrentUserPassword}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ChangeUserPassword