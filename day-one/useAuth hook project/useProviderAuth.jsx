import React, { useState } from "react";

const useProviderAuth = () => {
  const [user, setUser] = useState(null);
  const [loading,setLoading] = useState(true);
  const [errors,setErrors] = useState("");
  const authInfo = {
    user,
    setUser,
    loading,
    setLoading,
    errors,
    setErrors,
  };
  return authInfo;
};

export default useProviderAuth;
