// import React, { useEffect } from 'react';
// import useAppDispatch from '../../hooks/useAppDispatch';
// import useAppSelector from '../../hooks/useAppSelector';
// import { fetchLoggedInUserProfile } from '../../redux/reducers/usersReducer';

// const ProfilePage = () => {
//   const dispatch = useAppDispatch();
//   const { currentUser, loading, error } = useAppSelector((state) => state.userReducer);

//   useEffect(() => {
//     dispatch(fetchLoggedInUserProfile());
//   }, [dispatch]);

//   return (
//     <div>
//       <h2>ProfilePage</h2>

//       {loading ? (
//         <p>Loading...</p>
//       ) : error ? (
//         <p>{error}</p>
//       ) : (
//         <div>
//           <h4>Name: {currentUser?.name}</h4>
//           <h4>Email: {currentUser?.email}</h4>
//           <h4>Age: {currentUser?.age}</h4>
//           <h4>Role: {currentUser?.role}</h4>
//           <img src={currentUser?.avatar} alt="Avatar" />
//         </div>
//       )}
//     </div>
//   )
// }

// export default ProfilePage

import React, { useEffect, useState } from 'react';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { fetchLoggedInUserProfile } from '../../redux/reducers/usersReducer';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Header from './Header';

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { currentUser, loading, error } = useAppSelector((state) => state.userReducer);
  const [searchString, setSearchString] = useState("");

  const handleSearch = (searchString: string) => {
    setSearchString(searchString);
  };

  useEffect(() => {
    dispatch(fetchLoggedInUserProfile());
  }, [dispatch]);

  return (
    <div>
    <Header handleSearch={handleSearch} /> 
    <Card style={{ maxWidth: '400px', marginTop: "5rem" }}>
      <CardContent>
        <Typography variant="h5" component="div">
          ProfilePage
        </Typography>
        {loading ? (
          <CircularProgress /> // Show a loading spinner while data is loading
        ) : error ? (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        ) : (
          <div>
            <Typography variant="h6" gutterBottom>
              Name: {currentUser?.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Email: {currentUser?.email}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Age: {currentUser?.age}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Role: {currentUser?.role}
            </Typography>
            <img src={currentUser?.avatar} alt="Avatar" />
          </div>
        )}
      </CardContent>
    </Card>
    </div>
  );
};

export default ProfilePage;
