import React from "react";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const onClickLogin = () => {
    // Simulate a login process
    const token = "adafda54f5adf5a4"; // This should come from an API
    setToken(token);
    navigate("/");
  };

  return (
    <div>
      <h2 className="font-semibold text-2xl mb-6">Login Page</h2>
      <button className="btn btn-primary" onClick={onClickLogin}>
        Login
      </button>
    </div>
  );
};

export default LoginPage;
