import React, { useContext } from "react";
import { AuthContenxt } from "./Contexts";

const useAuthContext = () => {
  return useContext(AuthContenxt);
  
};

export default useAuthContext;
