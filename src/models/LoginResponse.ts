import {User} from "./AuthInterface"

export interface LoginResponse {
    access?: string;
    refresh?: string;
    user: User;
    otp_required: boolean; // ✅ Ensure this is explicitly defined
  }