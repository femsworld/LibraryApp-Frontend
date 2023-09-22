import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/layout/Home';
import Login from './components/Services/Login';
import SignUp from './components/Services/SignUp';
import CartPage from './components/layout/CartPage';
import BookDetails from './components/layout/BookDetails';
import ProfilePage from './components/layout/ProfilePage';
import PrivateRoute from './components/Services/PrivateRoute';
import AdminRoute from './components/Services/AdminRoute';
import DashBoard from './components/layout/DashBoard';

const App = () => {
  const storedUserProfile = localStorage.getItem("userProfile");
      const user = storedUserProfile && JSON.parse(storedUserProfile)
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/bookDetails/:id" element={<BookDetails />} />
        <Route path="/" element={<PrivateRoute isAuthenticated={!!storedUserProfile}/>}>
          <Route path="/profile" element={<ProfilePage/>}/>
        </Route>
        <Route path="/" element={<AdminRoute isAuthenticated={!!storedUserProfile} userRole={user?.role}/>}>
          <Route path="/dashboard" element={<DashBoard/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );  
};

export default App;

