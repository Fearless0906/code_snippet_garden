import axios from "axios";
import { API_BASE_URL } from "../../lib/client";

interface LoginData {
  email: string;
  password: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  re_password: string;
}

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  name: string;
  avatar?: string;
}

interface ResetPasswordData {
  email: string;
}

interface ResetPasswordConfirmData {
  uid: string;
  token: string;
  new_password: string;
  re_new_password: string;
}

class AuthService {
  async login(data: LoginData) {
    const response = await axios.post(
      `${API_BASE_URL}/accounts/auth/jwt/create/`,
      data
    );
    return response.data;
  }

  async getUserProfile(token: string): Promise<User> {
    const response = await axios.get(
      `${API_BASE_URL}/accounts/auth/users/me/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Ensure all fields are present
    const userData: User = {
      ...response.data,
      first_name: response.data.first_name || "",
      last_name: response.data.last_name || "",
      name:
        response.data.name ||
        `${response.data.first_name} ${response.data.last_name}`.trim(),
    };

    return userData;
  }

  async signup(data: SignupData) {
    const response = await axios.post(
      `${API_BASE_URL}/accounts/auth/users/`,
      data
    );
    return response.data;
  }

  async activate(data: { uid: string; token: string }) {
    const response = await axios.post(
      `${API_BASE_URL}/accounts/auth/users/activation/`,
      {
        uid: data.uid,
        token: data.token,
      }
    );
    return response.data;
  }

  async resetPassword(data: ResetPasswordData) {
    const response = await axios.post(
      `${API_BASE_URL}/accounts/auth/users/reset_password/`,
      data
    );
    return response.data;
  }

  async resetPasswordConfirm(data: ResetPasswordConfirmData) {
    const response = await axios.post(
      `${API_BASE_URL}/accounts/auth/users/reset_password_confirm/`,
      data
    );
    return response.data;
  }
}

export default new AuthService();
