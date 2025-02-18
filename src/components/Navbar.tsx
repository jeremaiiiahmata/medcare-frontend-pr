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
    <div className="h-14 w-full shadow-lg flex items-center justify-between px-2 bg-[#03624C]">
      <div className="container-menu flex items-center justify-center gap-7 mx-4 text-white">
      <img src="/medcare-logo.png" alt="" className="w-auto h-10"/>
        <Link to={"/patient-directory"}>
          <h2 className="font-semibold">Patients</h2>
        </Link>
        <Link to={"#"}>
          <h2 className="font-semibold">Prescriptions</h2>
        </Link>
        <Link to={"#"}>
          <h2 className="font-semibold">Pre-Assessments</h2>
        </Link>
        <Link to={"#"}>
          <h2 className="font-semibold">Edit Profile</h2>
        </Link>
      </div>
      
      <PrimaryBtn type="submit" onClick={logoutUser}>
        Logout
      </PrimaryBtn>
    </div>
  );
};

export default Navbar;
