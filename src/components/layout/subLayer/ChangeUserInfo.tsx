import React, { useState } from 'react'
import useAppDispatch from '../../../hooks/useAppDispatch';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { getCurrentUserProfile, updateUserInfo } from '../../../redux/reducers/usersReducer';
import useAppSelector from '../../../hooks/useAppSelector';
import { UserProfile } from '../../../types/UserProfile';

const ChangeUserInfo: React.FC<UserProfile> = ({name, age, id, avatar}) => {
   
    const [open, setOpen] = React.useState(false);
    const dispatch = useAppDispatch();
    const [ userName, setUserName ] = useState<UserProfile["name"]>(name)
    const [ userId ] = useState<UserProfile["id"]>(id)
    const [ userAge, setUserAge ] = useState<UserProfile["age"]>(age)
    const [ userAvatar, setUserAvatar ] = useState<UserProfile["avatar"]>(avatar)

    const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };

      const updateCurrentUserInfo = () => {
        dispatch(updateUserInfo({ id: userId,  name: userName, age: userAge, avatar: userAvatar }))
        handleClose()
      }

    //   useEffect (() => {
    //     dispatch(getCurrentUserProfile())
    //   }, [])

  return (
    <>
        <Button variant="outlined" onClick={handleClickOpen}>
        Update
      </Button>
        <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update User Information</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your new information.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <TextField
            type="number"
            label="Age"
            variant="outlined"
            fullWidth
            margin="normal"
            name="age"
            value={userAge}
            onChange={(e) => setUserAge(parseInt(e.target.value, 10))}
          />
          <TextField
            autoFocus
            margin="dense"
            id="avatar"
            label="Avatar"
            type="text"
            fullWidth
            variant="standard"
            value={userAvatar}
            onChange={(e) => setUserAvatar(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={updateCurrentUserInfo}>Update User</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ChangeUserInfo