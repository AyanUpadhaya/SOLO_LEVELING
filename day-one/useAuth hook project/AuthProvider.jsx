import React from "react";
import { AuthContenxt } from "./Contexts";
import useProviderAuth from "./useProviderAuth";
const AuthProvider = ({ children }) => {
  const auth = useProviderAuth();
  return <AuthContenxt.Provider value={auth}>{children}</AuthContenxt.Provider>;
};

export default AuthProvider;
