import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useState, useContext } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [focused, setFocused] = useState({
    email: false,
    password: false,
    otp: false
  });

  const authContext = useContext(AuthContext);
  const navigate = useNavigate(); // Redirect after login

  if (!authContext) {
    throw new Error("LoginForm must be used within an AuthProvider");
  }

  const { loginUser, verify2FA, is2FARequired, setIs2FARequired } = authContext;

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (is2FARequired) {
    const response = await loginUser(email, password, otp);
    console.log("OTP Response:", response); // Debugging

    const result = await verify2FA(otp);

    if (!result) {
      Swal.fire({
        title: "Invalid OTP",
        text: "Please check your OTP and try again.",
        icon: "error",
      });
      return;
    }

    return;
  }

  const response = await loginUser(email, password);
  console.log("Login Response:", response); // Debugging

  if (response?.otp_required) {
    setIs2FARequired(true);
  } else if (!response?.success) {
    Swal.fire({
      title: "Login Failed",
      text: response.error,
      icon: "error",
    });
  } else {
    navigate("/dashboard");
  }
};
  
  
  
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100">
      <motion.div 
        className="rounded-xl shadow-xl p-8 w-[30rem] bg-white border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="relative flex justify-between items-center mb-8">
          <motion.h1 
            className="absolute left-1/2 transform -translate-x-1/2 text-center font-bold text-[#03624C] text-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {is2FARequired ? "Enter OTP" : "Login"}
          </motion.h1>
          <Link to="/">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <IoMdArrowBack size={24} color="#03624C" />
            </motion.div>
          </Link>
        </div>

        <motion.form 
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex flex-col gap-6">
            {!is2FARequired ? (
              <>
                {/* Email Input */}
                <motion.div 
                  className="flex flex-col"
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <label className="text-[#03624C] text-lg font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#00DF82]"
                  />
                </motion.div>

                {/* Password Input */}
                <motion.div 
                  className="flex flex-col"
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                >
                  <label className="text-[#03624C] text-lg font-semibold mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#00DF82]"
                  />
                </motion.div>
              </>
            ) : (
              /* OTP Input */
              <motion.div 
                className="flex flex-col"
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <label className="text-[#03624C] text-lg font-semibold mb-2">
                  One-Time Password (OTP)
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#00DF82]"
                />
              </motion.div>
            )}
          </div>
          
          <div className="flex mt-10 justify-center">
            <motion.button 
              className="rounded-lg bg-[#03624C] hover:bg-[#2cc295] px-8 py-3 font-bold text-white cursor-pointer transition-colors duration-300 shadow-md"
              type="submit"
            >
              {is2FARequired ? "Verify OTP" : "Login"}
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default LoginForm;