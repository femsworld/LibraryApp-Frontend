import React, { useEffect } from 'react';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { fetchLoggedInUserProfile } from '../../redux/reducers/usersReducer';

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { currentUser, loading, error } = useAppSelector((state) => state.userReducer);

  useEffect(() => {
    dispatch(fetchLoggedInUserProfile());
  }, [dispatch]);

  return (
    <div>
      <h2>ProfilePage</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          <h4>Name: {currentUser?.name}</h4>
          <h4>Email: {currentUser?.email}</h4>
          <h4>Age: {currentUser?.age}</h4>
          <h4>Role: {currentUser?.role}</h4>
          <img src={currentUser?.avatar} alt="Avatar" />
        </div>
      )}
    </div>
  )
}

export default ProfilePage