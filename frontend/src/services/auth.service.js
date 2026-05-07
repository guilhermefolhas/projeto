import axios from "axios";

class AuthService {
  async login(email, password) {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/login",
        {
          email,
          password,
        }
      );

      return res.data;
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  }
}

export default new AuthService();