import React from "react";
import useAuth from "./useAuth";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) return <h2>Loading...</h2>;

  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
