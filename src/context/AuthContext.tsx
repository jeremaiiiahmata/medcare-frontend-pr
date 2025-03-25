import { createContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContextType, AuthTokens, User } from "../models/AuthInterface";
import { LoginResponse } from "../models/LoginResponse";
import axios from "axios";

interface Props {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: Props) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(() => {
    const tokens = localStorage.getItem("authTokens");
    return tokens ? JSON.parse(tokens) : null;
  });

  const [user, setUser] = useState<User | null>(() => {
    return authTokens ? jwtDecode<User>(authTokens.access) : null;
  });

  const [is2FARequired, setIs2FARequired] = useState<boolean>(false);
  const [emailFor2FA, setEmailFor2FA] = useState<string | null>(null); // Store email for OTP verification

  interface LoginResult {
  success: boolean;
  otp_required?: boolean;
}

const loginUser = async (email: string, password: string, otp?: string): Promise<LoginResult> => {
  try {

    console.log("🟢 Sending Request With:", { email, password, otp });
    setEmailFor2FA(email);

    const response = await axios.post("http://127.0.0.1:8000/api/token", {
      email,
      password,
      otp, // 🔥 Send OTP if provided
    });

    console.log("🟢 Response Data:", response.data);

    if (response.data.otp_required) {
      return { success: false, otp_required: true };
    }

    const data: AuthTokens = response.data;
    setAuthTokens(data);
    setUser(jwtDecode<User>(data.access));
    localStorage.setItem("authTokens", JSON.stringify(data));
    navigate("/dashboard");

    return { success: true };
  } catch (error: any) {
    console.error("🔴 Login Error:", error.response?.data);

    if (error.response?.data?.otp_required) {
      return { success: false, otp_required: true };
    }

    return { success: false };
  }
};


const verify2FA = async (otp: string): Promise<boolean> => {
  if (!emailFor2FA) {
    console.error("Missing email for OTP verification.");
    return false;
  }

  try {
    console.log("🟢 Current Email for 2FA:", emailFor2FA);
    console.log("Verifying 2FA...");

    const response = await fetch("http://127.0.0.1:8000/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailFor2FA, otp }),
    });

    if (!response.ok) {
      console.error("🔴 OTP Verification failed:", await response.text());
      return false; // Don't proceed if the OTP is invalid
    }

    const data: AuthTokens = await response.json();

    // ✅ Only proceed if verification was successful
    setAuthTokens(data);
    setUser(jwtDecode<User>(data.access));
    localStorage.setItem("authTokens", JSON.stringify(data));

    navigate("/dashboard");

    setIs2FARequired(false);
    setEmailFor2FA(null); // ✅ Reset email after successful verification

    return true;
  } catch (error) {
    console.error("🔴 OTP Verification failed:", error);
    return false;
  }
};

  const logoutUser = () => {
    Swal.fire({
      title: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes"
    }).then((result) => {
      if (result.isConfirmed) {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
        navigate("/");
        Swal.fire({
          title: "You have been logged out.",
          icon: "success",
          toast: true,
          timer: 2000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    });
  };

  const registerUser = async (
    email: string,
    username: string,
    password: string,
    passwordValidator: string
  ): Promise<void> => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password, passwordValidator }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Registration failed");
      }
  
      // Backend response (should confirm OTP was sent)
      const data = await response.json();
  
      Swal.fire({
        title: "OTP Sent",
        text: "An OTP has been sent to your email. Please verify your account.",
        icon: "info",
        confirmButtonText: "Enter OTP",
      }).then(() => {
        setIs2FARequired(true); // Show OTP input
        setEmailFor2FA(email); // Store email for verification
      });
  
    } catch (error) {
      Swal.fire({
        title: "Registration Failed",
        text: "Please try again.",
        icon: "error",
        toast: true,
        timer: 3000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  const contextData: AuthContextType = {
    user,
    setUser,
    authTokens: authTokens || null,
    setAuthTokens,
    registerUser,  // Ensure this line is present
    loginUser,
    logoutUser,
    verify2FA,
    is2FARequired,
    setIs2FARequired,
    emailFor2FA : emailFor2FA || null,  // ✅ Add `emailFor2FA`
    setEmailFor2FA,  // ✅ Ensure this is included
  };
  useEffect(() => {
    if (authTokens) {
      setUser(jwtDecode<User>(authTokens.access));
    }
    setLoading(false);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

export default AuthContext;