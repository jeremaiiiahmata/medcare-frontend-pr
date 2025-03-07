import { useContext, useState, useRef, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const context = useContext(AuthContext);
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  if (!context) {
    throw new Error("useAxios must be used within an AuthProvider");
  }

  const { logoutUser } = context;

  // Function to check if the tab is active
  const isActive = (path: string) => location.pathname === path;
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dropdown animation variants
  const dropdownVariants = {
    hidden: { 
      opacity: 0,
      y: -10,
      scale: 0.95,
      transformOrigin: "top right",
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: "easeIn"
      }
    }
  };

  // Button animation variants - removed scale from hover effect
  const buttonVariants = {
    idle: { boxShadow: "0px 0px 0px rgba(0, 223, 130, 0)" },
    hover: { boxShadow: "0px 0px 8px rgba(0, 223, 130, 0.6)" },
    tap: { scale: 0.95 }
  };

  return (
    <div className="h-20 w-full shadow-lg flex items-center justify-between px-2 bg-[#03624C]">
      <div className="container-menu flex items-center justify-center gap-10 mx-4">
        <img src="/medcare-primary-logo.png" alt="Logo" className="w-auto h-30 ml-5 object-contain" />

        {[
          { path: "/dashboard", label: "Dashboard" },
          { path: "/patient-directory", label: "Patients" },
          { path: "/prescription-list", label: "Prescriptions" },
          { path: "/preassessment-list", label: "Assessments" },
          { path: "/edit-profile", label: "Profile" }
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
      <div className="relative mx-4" ref={dropdownRef}>
        <div className="relative">
          <motion.button
            className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#00DF82] focus:outline-none cursor-pointer bg-white flex items-center justify-center"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
            animate={dropdownOpen ? "hover" : "idle"}
            variants={buttonVariants}
            transition={{ duration: 0.2 }}
          >
            <img src="/medcare-logo.png" alt="Profile" className="w-full h-full object-contain p-1" />
          </motion.button>
          
          {/* Separate container for indicator that doesn't scale with the button */}
          <motion.div 
            className="absolute -bottom-1 -right-1 bg-[#00DF82] rounded-full w-5 h-5 flex items-center justify-center z-10 pointer-events-none"
            initial={{ rotate: 0 }}
            animate={{ rotate: dropdownOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="white" 
              className="w-3 h-3"
            >
              <path d="M7 10l5 5 5-5H7z" />
            </svg>
          </motion.div>
        </div>

        {/* Animated Dropdown Menu */}
        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 border border-gray-200 overflow-hidden"
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div 
                className="absolute h-1 top-0 left-0 right-0 bg-gradient-to-r from-[#03624C] to-[#00DF82]"
                layoutId="dropdownHighlight"
              />
              
              {/* User info section */}
              <div className="px-4 py-2 border-b border-gray-100">
                <div className="text-sm font-medium text-gray-800">User Profile</div>
                <div className="text-xs text-gray-500">Medical Professional</div>
              </div>
              
              {/* Menu items */}
              <Link 
                to="/edit-profile"
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-150 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Profile Settings
              </Link>
              
              <button
                onClick={logoutUser}
                className="block w-full text-left px-4 py-2 text-red-600 font-medium hover:bg-red-50 transition-colors duration-150 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Navbar;