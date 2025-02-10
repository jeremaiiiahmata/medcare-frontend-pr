import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const PrivateRoute = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("PrivateRoute must be used within an AuthProvider");
  }

  const { user } = authContext;

  return user ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
