import { Link } from "react-router-dom";
import PrimaryButton from "../components/PrimaryBtn";
import SecodaryBtn from "../components/SecondaryBtn";
import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";

const HomePage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("PrivateRoute must be used within an AuthProvider");
  }

  const { loginUser } = authContext;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //prevents refreshing the page

    if (email.length > 0) {
      loginUser(email, password); //call the loginUser, passing email and password
    }
  };

  return (
    <>
      <div className="h-screen w-full flex items-center justify-center bg-[url(/bg.png)] bg-no-repeat bg-cover">
        <div className="h-[23rem] w-[28rem] shadow-lg rounded-lg p-6 z-10 bg-white">
          <div className="text-center mb-8 space-y-1">
            <h1 className="font-bold text-green-900 text-2xl">
              Welcome to MedCare
            </h1>
            <h2 className="font-light">Your Medication Companion</h2>
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
                  type="password"
                  placeholder="Password"
                  className="border rounded-md p-1 border-gray-300"
                />
              </div>
            </div>
            <div className=" flex gap-4 mt-10 justify-center">
              <PrimaryButton type="submit">Log in</PrimaryButton>

              <Link to="/register">
                <SecodaryBtn type="button">Register</SecodaryBtn>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default HomePage;
