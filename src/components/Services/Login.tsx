import React, { useState } from 'react'
import useAppDispatch from '../../hooks/useAppDispatch';
import { userLogin } from '../../redux/reducers/authenticationReducer';

interface DecodedToken {
  name: string;
}

const Login = () => {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [isLoggedIn, setIsLoggedIn] = useState(false);
const dispatch = useAppDispatch();

  const handleLogin = async () => {
    try {
      console.log("Logging in...");
      await dispatch(userLogin({ email, password })).unwrap();
      setIsLoggedIn(true);
      window.location.href = "/";
    } catch (error) {
      setError("Login failed. Please try again.");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Username and password are required");
    } else {
      handleLogin();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button>Login</button>
          {error && <p>{error}</p>}
        </form>
  )
}

export default Login