import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface AdminRouteProps {
  isAuthenticated: boolean;
  userRole: string
}

const PrivateRoute: React.FC<AdminRouteProps> = ({isAuthenticated, userRole} ) => {
  return isAuthenticated && userRole === "Admin" ? <Outlet></Outlet> : <Navigate to="/login" />
}

export default PrivateRoute
