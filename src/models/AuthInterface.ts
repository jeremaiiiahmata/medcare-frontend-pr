export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface DecodedToken {
  exp: number;
}

export interface User {
  user_id: number;
  email?: string;
  username: string;
}

export interface AuthContextType {
  user: User | null;
  authTokens: AuthTokens | null;
  setAuthTokens: (token: AuthTokens | null) => void;
  setUser: (user: User | null) => void;
  registerUser: (
    email: string,
    username: string,
    password: string,
    passwordValidator: string
  ) => Promise<void>;
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => void;
}
