import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useState, useContext } from "react";
import { IoMdArrowBack } from "react-icons/io";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("PrivateRoute must be used within an AuthProvider");
  }

  const { loginUser } = authContext;

  console.log(email);
  console.log(password);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //prevents refreshing the page

    if (email.length > 0 && password.length > 0) {
      loginUser(email, password); //call the loginUser, passing email and password
    }
  };

  return (
    <div className="h-full w-full">
    <div className="rounded-lg shadow-lg p-4 h-full w-[30rem]">
      <div className="relative flex justify-between items-center mb-4">
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-center font-bold text-green-900 text-2xl ">
          Login
        </h1>
        <Link to="/">
          <IoMdArrowBack size={24} color="#0d542b" />
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col">
            <label className="text-[#03624C] text-lg font-semibold">
              Email
            </label>
            <input
              type="text"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="Email Address"
              className="border rounded-md p-1 border-gray-300 "
            />
          </div>

          <div className="flex flex-col ">
            <label className="text-[#03624C] text-lg font-semibold">
              Password
            </label>
            <input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              placeholder="Password"
              className="border rounded-md p-1 border-gray-300"
            />
          </div>
        </div>
        <div className="flex gap-4 mt-10 justify-center">
          <button className="rounded-md bg-[#03624C] px-6 py-1.5 font-bold text-white cursor-pointer" type="submit">Login</button>
        </div>
      </form>
    </div>
    <div>
    <Link to="/register" className="mx-4">
        <p> No account yet? Register here.</p>
    </Link>
    </div>
  </div>
  );
};

export default LoginForm;
