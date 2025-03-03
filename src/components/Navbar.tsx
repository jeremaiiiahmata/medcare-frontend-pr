import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  const context = useContext(AuthContext);
  const location = useLocation(); // Get current URL path
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!context) {
    throw new Error("useAxios must be used within an AuthProvider");
  }

  const { logoutUser } = context;

  // Function to check if the tab is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="h-20 w-full shadow-lg flex items-center justify-between px-2 bg-[#03624C]">
      <div className="container-menu flex items-center justify-center gap-10 mx-4">
        <img src="/medcare-primary-logo.png" alt="Logo" className="w-auto h-30 ml-5 object-contain" />

        {[
          { path: "/dashboard", label: "Dashboard" },
          { path: "/patient-directory", label: "Patients" },
          { path: "/prescription-list", label: "Prescriptions" },
          { path: "/preassessment-list", label: "Assessments" },
          { path: "/edit-profile", label: "Edit Profile" }
        ].map(({ path, label }) => (
          <div key={path} className="relative">
            <Link
              to={path}
              className={`font-semibold px-4 py-2 transition-colors duration-300 ${
                isActive(path) ? "text-[#00DF82]" : "text-white hover:text-gray-300"
              }`}
            >
              {label}
            </Link>

            {/* Animated Underline for Active Tab */}
            {isActive(path) && (
              <motion.div
                className="mt-1 h-[3px] bg-[#00DF82] rounded-md"
                layoutId="underline"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Profile Dropdown Button */}
      <div className="relative mx-4">
        <button
          className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#00DF82] focus:outline-none cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <img src="/medcare-logo.png" alt="Profile" className="w-full h-full object-contain p-1" />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md py-2 border">
            <button
              onClick={logoutUser}
              className="block w-full text-left px-4 py-2 text-red-600 font-semibold hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
