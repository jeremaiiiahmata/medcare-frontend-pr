import React from "react";
import AuthContext from "../context/AuthContext";
import { useState, useContext } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const RegisterForm = () => {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordValidator, setPasswordValidator] = useState<string>("");
  const [focused, setFocused] = useState({
    email: false,
    username: false,
    password: false,
    confirmPassword: false
  });

  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("PrivateRoute must be used within an AuthProvider");
  }

  const { registerUser } = authContext;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    registerUser(email, username, password, passwordValidator);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100">
      <motion.div 
        className="rounded-xl shadow-xl p-8 w-[30rem] bg-white border border-gray-100 overflow-hidden"
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
            Register
          </motion.h1>
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
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
            <motion.div 
              className="flex flex-col"
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <label className="text-[#03624C] text-lg font-semibold mb-2">
                Email
              </label>
              <div className={`relative rounded-lg overflow-hidden transition-all duration-300 ${focused.email ? 'ring-2 ring-[#00DF82]' : 'ring-1 ring-gray-200 hover:ring-gray-300'}`}>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused({...focused, email: true})}
                  onBlur={() => setFocused({...focused, email: false})}
                  placeholder="Email Address"
                  className="w-full p-3 border-none outline-none bg-gray-50"
                />
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-[#00DF82]"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: focused.email ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>

            <motion.div 
              className="flex flex-col"
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <label className="text-[#03624C] text-lg font-semibold mb-2">
                Username
              </label>
              <div className={`relative rounded-lg overflow-hidden transition-all duration-300 ${focused.username ? 'ring-2 ring-[#00DF82]' : 'ring-1 ring-gray-200 hover:ring-gray-300'}`}>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocused({...focused, username: true})}
                  onBlur={() => setFocused({...focused, username: false})}
                  placeholder="Username"
                  className="w-full p-3 border-none outline-none bg-gray-50"
                />
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-[#00DF82]"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: focused.username ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>

            <motion.div 
              className="flex flex-col"
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              <label className="text-[#03624C] text-lg font-semibold mb-2">
                Password
              </label>
              <div className={`relative rounded-lg overflow-hidden transition-all duration-300 ${focused.password ? 'ring-2 ring-[#00DF82]' : 'ring-1 ring-gray-200 hover:ring-gray-300'}`}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused({...focused, password: true})}
                  onBlur={() => setFocused({...focused, password: false})}
                  placeholder="Password"
                  className="w-full p-3 border-none outline-none bg-gray-50"
                />
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-[#00DF82]"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: focused.password ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>

            <motion.div 
              className="flex flex-col"
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              <label className="text-[#03624C] text-lg font-semibold mb-2">
                Confirm Password
              </label>
              <div className={`relative rounded-lg overflow-hidden transition-all duration-300 ${focused.confirmPassword ? 'ring-2 ring-[#00DF82]' : 'ring-1 ring-gray-200 hover:ring-gray-300'}`}>
                <input
                  type="password"
                  value={passwordValidator}
                  onChange={(e) => setPasswordValidator(e.target.value)}
                  onFocus={() => setFocused({...focused, confirmPassword: true})}
                  onBlur={() => setFocused({...focused, confirmPassword: false})}
                  placeholder="Confirm Password"
                  className="w-full p-3 border-none outline-none bg-gray-50"
                />
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-[#00DF82]"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: focused.confirmPassword ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          </div>
          
          <div className="flex mt-10 justify-center">
            <motion.button 
              className="rounded-lg bg-[#03624C] hover:bg-[#2cc295] px-8 py-3 font-bold text-white cursor-pointer transition-colors duration-300 shadow-md"
              type="submit"
              whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 223, 130, 0.2)" }}
              whileTap={{ scale: 0.97 }}
            >
              Register
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
      
      <motion.div
        className="mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <Link to="/login" className="text-[#03624C] hover:text-[#00DF82] transition-colors duration-300 font-medium">
          <p>Already have an account? <span className="underline">Login here</span></p>
        </Link>
      </motion.div>
    </div>
  );
};

export default RegisterForm;