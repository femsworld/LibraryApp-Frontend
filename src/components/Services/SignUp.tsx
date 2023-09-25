import React, { useState } from 'react';
import useAppDispatch from '../../hooks/useAppDispatch';
import { createOneUser } from '../../redux/reducers/usersReducer';
import { TextField, Button, Typography, Box, Avatar } from '@mui/material';
import { PersonOutline } from '@mui/icons-material';
import { Snackbar } from '@mui/material';

const defaultAvatar = 'https://upload.wikimedia.org/wikipedia/fi/4/45/Yoda.jpg';

const SignUp = () => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState(0);
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(createOneUser({ name, email, password, avatar, age }));
      alert('User successfully created! Please login');
      window.location.href = '/login';
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Error creating user. Please try again.');
    }
  };

  const clearAvatar = () => {
    setAvatar(defaultAvatar);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <div className="signup-box" style={{ width: '300px' }}>
        <Typography variant="h5" gutterBottom>
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            type="text"
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            type="email"
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            type="password"
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            type="number"
            label="Age"
            variant="outlined"
            fullWidth
            margin="normal"
            name="age"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value, 10))}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Sign Up
          </Button>
        </form>
        {error && (
          <Typography variant="body2" color="error" style={{ marginTop: '10px' }}>
            {error}
          </Typography>
        )}
      </div>
    </Box>
  );
};

export default SignUp;


