import { jwtDecode } from "jwt-decode";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

interface JwtPayload {
  user_id: string;
}

const Dashboard = () => {
  //grab the user and logoutUser context
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAxios must be used within an AuthProvider");
  }

  const { user, logoutUser } = context;
  const token = localStorage.getItem("authTokens");

  if (token) {
    const decoded = jwtDecode<JwtPayload>(token);
    let user_id = decoded.user_id;
  }

  return (
    <>
      <h1>Hello world</h1>
      <button onClick={logoutUser}>Logout</button>
    </>
  );
};

export default Dashboard;
