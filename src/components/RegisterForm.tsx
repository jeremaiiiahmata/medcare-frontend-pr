import React from "react";
import AuthContext from "../context/AuthContext";
import { useState, useContext } from "react";
import PrimaryBtn from "./PrimaryBtn";
import { IoMdArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";

const RegisterForm = () => {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordValidator, setPasswordValidator] = useState<string>("");

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
    <div className="h-full w-full">
      <div className="rounded-lg shadow-lg p-4 h-full w-[30rem]">
        <div className="relative flex justify-between items-center mb-4">
          <h1 className="absolute left-1/2 transform -translate-x-1/2 text-center font-bold text-green-900 text-2xl ">
            Register
          </h1>
          <Link to="/">
            <IoMdArrowBack size={24} color="#0d542b" />
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col">
              <label className="text-green-900 text-lg font-semibold">
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
              <label className="text-green-900 text-lg font-semibold">
                Username
              </label>
              <input
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                type="text"
                placeholder="Username"
                className="border rounded-md p-1 border-gray-300"
              />
            </div>

            <div className="flex flex-col ">
              <label className="text-green-900 text-lg font-semibold">
                Password
              </label>
              <input
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type="text"
                placeholder="Password"
                className="border rounded-md p-1 border-gray-300"
              />
            </div>

            <div className="flex flex-col ">
              <label className="text-green-900 text-lg font-semibold">
                Confirm Password
              </label>
              <input
                onChange={(e) => {
                  setPasswordValidator(e.target.value);
                }}
                type="text"
                placeholder="Confirm Password"
                className="border rounded-md p-1 border-gray-300"
              />
            </div>
          </div>
          <div className=" flex gap-4 mt-10 justify-center">
            <PrimaryBtn type="submit">Register</PrimaryBtn>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
