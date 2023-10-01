export interface AuthResponse {
  id: string;
  email: string;
  username: string;
  role: string;
  profile_image: string;
  accessToken?: string;
  actions?: any;
}
