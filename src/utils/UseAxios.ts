import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { AuthTokens, DecodedToken } from "../models/AuthInterface";
import dayjs from "dayjs";

const baseURL = "http://127.0.0.1:8000/api";

const useAxios = (): AxiosInstance => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("useAxios must be used within an AuthProvider");
  }

  const { authTokens, setUser, setAuthTokens } = authContext;

  const axiosInstance = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${authTokens?.access}`, //if there is authToken, access is granted.
    },
  });

  axiosInstance.interceptors.request.use(
    async (req: InternalAxiosRequestConfig) => {
      if (!authTokens) return req;

      try {
        const decodedToken = jwtDecode<DecodedToken>(authTokens.access);
        const isExpired = dayjs.unix(decodedToken.exp).diff(dayjs()) < 1;

        if (!isExpired) return req;

        const response = await axios.post<AuthTokens>(
          `${baseURL}/token/refresh`,
          {
            refresh: authTokens.refresh,
          }
        );

        localStorage.setItem("authTokens", JSON.stringify(response.data));
        setAuthTokens(response.data);
        setUser(jwtDecode(response.data.access));

        req.headers.Authorization = `Bearer ${response.data.access}`;
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Token refresh failed:", error.message);
        } else {
          console.error("Token refresh failed with an unknown error");
        }
      }

      return req;
    }
  );

  return axiosInstance;
};

export default useAxios;
