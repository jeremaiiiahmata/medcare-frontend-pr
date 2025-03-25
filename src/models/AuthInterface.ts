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

export interface LoginResult {
  success: boolean;
  otp_required?: boolean;
  error? : string;
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
  loginUser: (email: string, password: string, otp?: string) => Promise<LoginResult>;
  logoutUser: () => void;
  verify2FA: (otp: string) => Promise<boolean>;
  emailFor2FA: string | null;  // ✅ Ensure this is present
  setEmailFor2FA: React.Dispatch<React.SetStateAction<string | null>>;

  // ✅ Ensure 2FA state is tracked correctly
  is2FARequired: boolean;
  setIs2FARequired: (required: boolean) => void; // ✅ Add setter function
}
