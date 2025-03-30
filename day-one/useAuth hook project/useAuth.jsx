import React, { useEffect, useState } from "react";

const useAuth = () => {
  const [token, setToken] = useState(() => localStorage.getItem("auth_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem("auth_token", token);
    }
    setLoading(false);
  }, [token]);

  return { setToken, token, loading };
};

export default useAuth;
