import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import PrimaryBtn from "./PrimaryBtn";
import { Link } from "react-router-dom";

const Navbar = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAxios must be used within an AuthProvider");
  }

  const { logoutUser } = context;

  return (
    <div className="h-14 w-full shadow-lg flex items-center justify-between px-2">
      <h2 className="font-bold text-green-950">MedCare</h2>
      <Link to={"/patient-directory"}>
        <h2 className="font-semibold">Patient Directory</h2>
      </Link>
      <PrimaryBtn type="submit" onClick={logoutUser}>
        Logout
      </PrimaryBtn>
    </div>
  );
};

export default Navbar;
