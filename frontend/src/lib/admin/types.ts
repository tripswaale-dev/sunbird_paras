export interface AdminUser {
  id: number;
  name: string;
  email: string;
}

export interface AdminLoginResponse {
  token: string;
  user: AdminUser;
}

export interface AdminLogoutResponse {
  message: string;
}
