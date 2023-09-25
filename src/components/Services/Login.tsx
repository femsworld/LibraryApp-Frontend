import React, { useState } from 'react';
import useAppDispatch from '../../hooks/useAppDispatch';
import { userLogin } from '../../redux/reducers/authenticationReducer';
import { TextField, Button, Typography, Box } from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    try {
      console.log('Logging in...');
      await dispatch(userLogin({ email, password })).unwrap();
      setIsLoggedIn(true);
      window.location.href = '/';
    } catch (error) {
      setError('Login failed. Please try again.');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Username and password are required');
    } else {
      handleLogin();
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <div className="login-box">
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            type="text"
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
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
          {error && (
            <Typography variant="body2" color="error" style={{ marginTop: '10px' }}>
              {error}
            </Typography>
          )}
        </form>
      </div>
    </Box>
  );
};

export default Login;
