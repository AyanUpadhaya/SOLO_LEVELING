import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const onClickLogOut = () => {
    localStorage.removeItem("auth_token");
    navigate("/login");
  };

  return (
    <div>
      <h2 className="font-semibold text-2xl mb-6">Home Page</h2>
      <p>User logged in</p>
      <button className="btn btn-primary" onClick={onClickLogOut}>
        Logout
      </button>
    </div>
  );
};

export default HomePage;
