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

  const { user } = context;
  const token = localStorage.getItem("authTokens");

  if (token) {
    const decoded = jwtDecode<JwtPayload>(token);
    let user_id = decoded.user_id;
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="grid grid-cols-2 w-full">
          <div className="shadow-lg w-96 h-64 rounded-lg place-items-center place-content-center">
            <h1 className="font-semibold text-2xl">
              Welcome, {user?.username}
            </h1>
          </div>
          <div className="shadow-lg w-64 h-64 rounded-lg place-items-center place-content-center">
            <h1 className="font-semibold text-2xl">
              Welcome, {user?.username}
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
