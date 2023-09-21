import React, { useState, useEffect, useRef } from "react";
import { createOneUser } from "../../redux/reducers/usersReducer";
import useAppDispatch from "../../hooks/useAppDispatch";

const SignUp = () => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const defaultAvatar =
    "https://upload.wikimedia.org/wikipedia/fi/4/45/Yoda.jpg";
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState(0);
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [error, setError] = useState("");


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(createOneUser({ name, email, password, avatar, age}));
      alert("User successfully created! Please login");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const clearAvatar = () => {
    setAvatar(defaultAvatar);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div data-testid="signup">
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
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
        <input
          type="number"
          name="age"
          placeholder="age"
          value={age}
          onChange={(e) => setAge(parseInt(e.target.value, 10))}
        />
        <button> Submit form </button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default SignUp;

