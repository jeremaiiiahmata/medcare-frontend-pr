import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAxios must be used within an AuthProvider");
  }

  const { logoutUser } = context;

  return (
    <div className="h-20 w-full shadow-lg flex items-center justify-between px-2 bg-[#03624C]">
      <div className="container-menu flex items-center justify-center gap-13 mx-4 text-white">
      <img src="/medcare-primary-logo.png" alt="" className="w-auto h-30 ml-5 object-contain"/>

        <Link to={"/dashboard"}>
          <h2 className="font-semibold">Dashboard</h2>
        </Link>
        <Link to={"/patient-directory"}>
          <h2 className="font-semibold">Patients</h2>
        </Link>
        <Link to={"/prescription-list"}>
          <h2 className="font-semibold">Prescriptions</h2>
        </Link>
        <Link to={"/preassessments"}>
          <h2 className="font-semibold">Pre-Assessments</h2>
        </Link>
        <Link to={"/edit-profile"}>
          <h2 className="font-semibold">Edit Profile</h2>
        </Link>
        
      </div>
      
      <button className="mx-4 bg-red-700 px-5 py-2 rounded-md text-white font-bold cursor-pointer" type="submit" onClick={logoutUser}>
        Logout
      </button>
    </div>
  );
};

export default Navbar;
